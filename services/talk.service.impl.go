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

type TalkServiceImpl struct {
	talkCollection *mongo.Collection
	ctx            context.Context
}

func NewTalkService(talkCollection *mongo.Collection, ctx context.Context) TalkService {
	return &TalkServiceImpl{talkCollection, ctx}
}

func (d *TalkServiceImpl) CreateTalk(talk *models.CreateTalkRequest) (*models.DBTalk, error) {

	res, err := d.talkCollection.InsertOne(d.ctx, talk)
	if err != nil {
		return nil, err
	}

	var newTalk *models.DBTalk
	query := bson.M{"_id": res.InsertedID}
	if err = d.talkCollection.FindOne(d.ctx, query).Decode(&newTalk); err != nil {
		return nil, err
	}

	return newTalk, nil
}

func (d *TalkServiceImpl) UpdateTalk(id string, data *models.UpdateTalk) (*models.DBTalk, error) {
	doc, err := utils.ToDoc(data)
	if err != nil {
		return nil, err
	}

	obId, _ := primitive.ObjectIDFromHex(id)
	query := bson.D{{Key: "_id", Value: obId}}
	update := bson.D{{Key: "$set", Value: doc}}
	res := d.talkCollection.FindOneAndUpdate(d.ctx, query, update, options.FindOneAndUpdate().SetReturnDocument(1))

	var updatedTalk *models.DBTalk
	if err := res.Decode(&updatedTalk); err != nil {
		return nil, errors.New("no talk with that Id exists")
	}

	return updatedTalk, nil
}

func (d *TalkServiceImpl) FindTalkById(id string) (*models.DBTalk, error) {
	obId, _ := primitive.ObjectIDFromHex(id)

	query := bson.M{"_id": obId}

	var talk *models.DBTalk

	if err := d.talkCollection.FindOne(d.ctx, query).Decode(&talk); err != nil {
		if err == mongo.ErrNoDocuments {
			return nil, errors.New("no document with that Id exists")
		}

		return nil, err
	}

	return talk, nil
}

func (p *TalkServiceImpl) FindTalks(page int, limit int) ([]*models.DBTalk, error) {
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

	cursor, err := p.talkCollection.Find(p.ctx, query, &opt)
	if err != nil {
		return nil, err
	}

	defer cursor.Close(p.ctx)

	var talks []*models.DBTalk

	for cursor.Next(p.ctx) {
		talk := &models.DBTalk{}
		err := cursor.Decode(talk)

		if err != nil {
			return nil, err
		}

		talks = append(talks, talk)
	}

	if err := cursor.Err(); err != nil {
		return nil, err
	}

	if len(talks) == 0 {
		return []*models.DBTalk{}, nil
	}

	return talks, nil
}

func (d *TalkServiceImpl) DeleteTalk(id string) error {
	obId, _ := primitive.ObjectIDFromHex(id)
	query := bson.M{"_id": obId}

	res, err := d.talkCollection.DeleteOne(d.ctx, query)
	if err != nil {
		return err
	}

	if res.DeletedCount == 0 {
		return errors.New("no document with that Id exists")
	}

	return nil
}