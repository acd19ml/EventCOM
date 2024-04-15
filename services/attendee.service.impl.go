package services

import (
	"context"
	"errors"

	"github.com/acd19ml/EventCOM/utils"
	"github.com/acd19ml/EventCOM/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type AttendeeServiceImpl struct {
	dateCollection *mongo.Collection
	ctx            context.Context
}

func NewAttendeeService(dateCollection *mongo.Collection, ctx context.Context) AttendeeService {
	return &AttendeeServiceImpl{dateCollection, ctx}
}

func (d *AttendeeServiceImpl) CreateAttendee(date *models.CreateAttendeeRequest) (*models.DBAttendee, error) {

	res, err := d.dateCollection.InsertOne(d.ctx, date)
	if err != nil {
		return nil, err
	}

	var newAttendee *models.DBAttendee
	query := bson.M{"_id": res.InsertedID}
	if err = d.dateCollection.FindOne(d.ctx, query).Decode(&newAttendee); err != nil {
		return nil, err
	}

	return newAttendee, nil
}

func (d *AttendeeServiceImpl) UpdateAttendee(id string, data *models.UpdateAttendee) (*models.DBAttendee, error) {
	doc, err := utils.ToDoc(data)
	if err != nil {
		return nil, err
	}

	obId, _ := primitive.ObjectIDFromHex(id)
	query := bson.D{{Key: "_id", Value: obId}}
	update := bson.D{{Key: "$set", Value: doc}}
	res := d.dateCollection.FindOneAndUpdate(d.ctx, query, update, options.FindOneAndUpdate().SetReturnDocument(1))

	var updatedAttendee *models.DBAttendee
	if err := res.Decode(&updatedAttendee); err != nil {
		return nil, errors.New("no date with that Id exists")
	}

	return updatedAttendee, nil
}

func (d *AttendeeServiceImpl) FindAttendeeById(id string) (*models.DBAttendee, error) {
	obId, _ := primitive.ObjectIDFromHex(id)

	query := bson.M{"_id": obId}

	var date *models.DBAttendee

	if err := d.dateCollection.FindOne(d.ctx, query).Decode(&date); err != nil {
		if err == mongo.ErrNoDocuments {
			return nil, errors.New("no document with that Id exists")
		}

		return nil, err
	}

	return date, nil
}

func (p *AttendeeServiceImpl) FindAttendees(page int, limit int) ([]*models.DBAttendee, error) {
	if page == 0 {
		page = 1
	}

	if limit == 0 {
		limit = 10
	}

	skip := (page - 1) * limit

	opt := options.FindOptions{}
	opt.SetLimit(int64(limit))
	opt.SetSkip(int64(skip))
	opt.SetSort(bson.M{"created_at": -1})

	query := bson.M{}

	cursor, err := p.dateCollection.Find(p.ctx, query, &opt)
	if err != nil {
		return nil, err
	}

	defer cursor.Close(p.ctx)

	var dates []*models.DBAttendee

	for cursor.Next(p.ctx) {
		date := &models.DBAttendee{}
		err := cursor.Decode(date)

		if err != nil {
			return nil, err
		}

		dates = append(dates, date)
	}

	if err := cursor.Err(); err != nil {
		return nil, err
	}

	if len(dates) == 0 {
		return []*models.DBAttendee{}, nil
	}

	return dates, nil
}

func (d *AttendeeServiceImpl) DeleteAttendee(id string) error {
	obId, _ := primitive.ObjectIDFromHex(id)
	query := bson.M{"_id": obId}

	res, err := d.dateCollection.DeleteOne(d.ctx, query)
	if err != nil {
		return err
	}

	if res.DeletedCount == 0 {
		return errors.New("no document with that Id exists")
	}

	return nil
}
