package models

import (

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type CreateAttendanceRequest struct {
	Email     string    	`json:"email" bson:"email" binding:"required"`
	PostId	 string    	`json:"postId" bson:"postId" binding:"required"`
}

type DBAttendance struct {
	Id        primitive.ObjectID `json:"id,omitempty" bson:"_id,omitempty"`
	Email     string `json:"email" bson:"email"`
	PostId	 string    `json:"postId" bson:"postId"`
}


type UpdateAttendance struct {
	Email     string `json:"email" bson:"email"`
	PostId	 string    `json:"postId" bson:"postId"`
}