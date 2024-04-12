package models

import (

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type CreateTalkRequest struct {
	Talk     string    `json:"talk" bson:"talk" binding:"required"`
	Detail	 string    `json:"detail" bson:"detail" binding:"required"`
}

type DBTalk struct {
	Id        primitive.ObjectID `json:"id,omitempty" bson:"_id,omitempty"`
	Talk      string    `json:"talk,omitempty" bson:"talk,omitempty"`
	Detail	  string    `json:"detail,omitempty" bson:"detail,omitempty"`
}


type UpdateTalk struct {
	Talk     string    `json:"talk,omitempty" bson:"talk,omitempty"`
	Detail	 string    `json:"detail,omitempty" bson:"detail,omitempty"` 
}