package models

import (

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type CreateAttendeeRequest struct {
	Email     	string    `json:"email" bson:"email" binding:"required"`
	Role	string    `json:"role" bson:"role" binding:"required"`
	Interests 	[]string `json:"interests" bson:"interests" binding:"required"`
	Status      string    `json:"status,omitempty" bson:"status,omitempty"`
}

type DBAttendee struct {
	Id        	primitive.ObjectID `json:"id,omitempty" bson:"_id,omitempty"`
	Email     	string    `json:"email,omitempty" bson:"email,omitempty"`
	Role	string    `json:"role,omitempty" bson:"role,omitempty"`
	Interests 	[]string `json:"interests,omitempty" bson:"interests,omitempty"`
	Status      string    `json:"status,omitempty" bson:"status,omitempty"`
}

type UpdateAttendee struct {
	Email     	string    `json:"email,omitempty" bson:"email,omitempty"`
	Role	string    `json:"role,omitempty" bson:"role,omitempty"`
	Interests 	[]string `json:"interests,omitempty" bson:"interests,omitempty"`
	Status      string    `json:"status,omitempty" bson:"status,omitempty"`
}