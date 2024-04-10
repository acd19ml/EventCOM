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

type DateServiceImpl struct {
	dateCollection *mongo.Collection
	ctx            context.Context
}

func NewDateService(dateCollection *mongo.Collection, ctx context.Context) DateService {
	return &DateServiceImpl{dateCollection, ctx}
}

func (d *DateServiceImpl) CreateDate(date *models.CreateDateRequest) (*models.DBDate, error) {

	res, err := d.dateCollection.InsertOne(d.ctx, date)
	if err != nil {
		return nil, err
	}

	var newDate *models.DBDate
	query := bson.M{"_id": res.InsertedID}
	if err = d.dateCollection.FindOne(d.ctx, query).Decode(&newDate); err != nil {
		return nil, err
	}

	return newDate, nil
}

func (d *DateServiceImpl) UpdateDate(id string, data *models.UpdateDate) (*models.DBDate, error) {
	doc, err := utils.ToDoc(data)
	if err != nil {
		return nil, err
	}

	obId, _ := primitive.ObjectIDFromHex(id)
	query := bson.D{{Key: "_id", Value: obId}}
	update := bson.D{{Key: "$set", Value: doc}}
	res := d.dateCollection.FindOneAndUpdate(d.ctx, query, update, options.FindOneAndUpdate().SetReturnDocument(1))

	var updatedDate *models.DBDate
	if err := res.Decode(&updatedDate); err != nil {
		return nil, errors.New("no date with that Id exists")
	}

	return updatedDate, nil
}

func (d *DateServiceImpl) FindDateById(id string) (*models.DBDate, error) {
	obId, _ := primitive.ObjectIDFromHex(id)

	query := bson.M{"_id": obId}

	var date *models.DBDate

	if err := d.dateCollection.FindOne(d.ctx, query).Decode(&date); err != nil {
		if err == mongo.ErrNoDocuments {
			return nil, errors.New("no document with that Id exists")
		}

		return nil, err
	}

	return date, nil
}

func (p *DateServiceImpl) FindDates(page int, limit int) ([]*models.DBDate, error) {
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

	var dates []*models.DBDate

	for cursor.Next(p.ctx) {
		date := &models.DBDate{}
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
		return []*models.DBDate{}, nil
	}

	return dates, nil
}

func (d *DateServiceImpl) DeleteDate(id string) error {
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
