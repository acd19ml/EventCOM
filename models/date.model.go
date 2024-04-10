package models

import (

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type CreateDateRequest struct {
	Date     string    `json:"date" bson:"date" binding:"required"`
	Detail	 string    `json:"detail" bson:"detail" binding:"required"`
}

type DBDate struct {
	Id        primitive.ObjectID `json:"id,omitempty" bson:"_id,omitempty"`
	Date      string    `json:"date,omitempty" bson:"date,omitempty"`
	Detail	  string    `json:"detail,omitempty" bson:"detail,omitempty"`
}


type UpdateDate struct {
	Date     string    `json:"date,omitempty" bson:"date,omitempty"`
	Detail	 string    `json:"detail,omitempty" bson:"detail,omitempty"` 
}