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

type AttendanceServiceImpl struct {
	attendanceCollection *mongo.Collection
	ctx            context.Context
}

func NewAttendanceService(attendanceCollection *mongo.Collection, ctx context.Context) AttendanceService {
	return &AttendanceServiceImpl{attendanceCollection, ctx}
}

func (d *AttendanceServiceImpl) CreateAttendance(attendance *models.CreateAttendanceRequest) (*models.DBAttendance, error) {

	res, err := d.attendanceCollection.InsertOne(d.ctx, attendance)
	if err != nil {
		return nil, err
	}

	var newAttendance *models.DBAttendance
	query := bson.M{"_id": res.InsertedID}
	if err = d.attendanceCollection.FindOne(d.ctx, query).Decode(&newAttendance); err != nil {
		return nil, err
	}

	return newAttendance, nil
}

func (d *AttendanceServiceImpl) UpdateAttendance(id string, data *models.UpdateAttendance) (*models.DBAttendance, error) {
	doc, err := utils.ToDoc(data)
	if err != nil {
		return nil, err
	}

	obId, _ := primitive.ObjectIDFromHex(id)
	query := bson.D{{Key: "_id", Value: obId}}
	update := bson.D{{Key: "$set", Value: doc}}
	res := d.attendanceCollection.FindOneAndUpdate(d.ctx, query, update, options.FindOneAndUpdate().SetReturnDocument(1))

	var updatedAttendance *models.DBAttendance
	if err := res.Decode(&updatedAttendance); err != nil {
		return nil, errors.New("no attendance with that Id exists")
	}

	return updatedAttendance, nil
}

func (d *AttendanceServiceImpl) FindAttendanceById(id string) (*models.DBAttendance, error) {
	obId, _ := primitive.ObjectIDFromHex(id)

	query := bson.M{"_id": obId}

	var attendance *models.DBAttendance

	if err := d.attendanceCollection.FindOne(d.ctx, query).Decode(&attendance); err != nil {
		if err == mongo.ErrNoDocuments {
			return nil, errors.New("no document with that Id exists")
		}

		return nil, err
	}

	return attendance, nil
}

func (p *AttendanceServiceImpl) FindAttendances(page int, limit int) ([]*models.DBAttendance, error) {
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

	cursor, err := p.attendanceCollection.Find(p.ctx, query, &opt)
	if err != nil {
		return nil, err
	}

	defer cursor.Close(p.ctx)

	var attendances []*models.DBAttendance

	for cursor.Next(p.ctx) {
		attendance := &models.DBAttendance{}
		err := cursor.Decode(attendance)

		if err != nil {
			return nil, err
		}

		attendances = append(attendances, attendance)
	}

	if err := cursor.Err(); err != nil {
		return nil, err
	}

	if len(attendances) == 0 {
		return []*models.DBAttendance{}, nil
	}

	return attendances, nil
}

func (d *AttendanceServiceImpl) DeleteAttendance(id string) error {
	obId, _ := primitive.ObjectIDFromHex(id)
	query := bson.M{"_id": obId}

	res, err := d.attendanceCollection.DeleteOne(d.ctx, query)
	if err != nil {
		return err
	}

	if res.DeletedCount == 0 {
		return errors.New("no document with that Id exists")
	}

	return nil
}