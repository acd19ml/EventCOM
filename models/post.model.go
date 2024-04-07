package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)
//email, name, role, organisation, contact details, kind of talk I like to give, Talk Title, Talk Description, choose Possible dates and extra
type CreatePostRequest struct {
	Email     string    `json:"email" bson:"email" binding:"required"`
	Name      string    `json:"name" bson:"name" binding:"required"`
	Role      string    `json:"role" bson:"role" binding:"required"`
	Organisation string    `json:"organisation" bson:"organisation" binding:"required"`
	Contact   string    `json:"contact,omitempty" bson:"contact,omitempty"`
	KindofTalk []string    `json:"kind_of_talk,omitempty" bson:"kind_of_talk,omitempty"`
	Title     string    `json:"title,omitempty" bson:"title,omitempty"`
	Description string    `json:"description,omitempty" bson:"description,omitempty"`
	Dates     []string  `json:"dates,omitempty" bson:"dates,omitempty"`
	ExtraDetails string    `json:"extra_details,omitempty" bson:"extra_details,omitempty"`
	Location  string    `json:"location,omitempty" bson:"location,omitempty"`
	Status    string    `json:"status,omitempty" bson:"status,omitempty"`
	CreateAt  time.Time `json:"created_at,omitempty" bson:"created_at,omitempty"`
	UpdatedAt time.Time `json:"updated_at,omitempty" bson:"updated_at,omitempty"`
}

type DBPost struct {
	Id        primitive.ObjectID `json:"id,omitempty" bson:"_id,omitempty"`
	Email     string    `json:"email,omitempty" bson:"email,omitempty"`
	Name      string    `json:"name,omitempty" bson:"name,omitempty"`
	Role      string    `json:"role,omitempty" bson:"role,omitempty"`
	Organisation string    `json:"organisation" bson:"organisation"`
	Contact   string    `json:"contact,omitempty" bson:"contact,omitempty"`
	KindofTalk []string    `json:"kind_of_talk,omitempty" bson:"kind_of_talk,omitempty"`
	Title     string    `json:"title,omitempty" bson:"title,omitempty"`
	Description string    `json:"description,omitempty" bson:"description,omitempty"`
	Dates     []string  `json:"dates,omitempty" bson:"dates,omitempty"`
	ExtraDetails string    `json:"extra_details,omitempty" bson:"extra_details,omitempty"`
	Location  string    `json:"location,omitempty" bson:"location,omitempty"`
	Status    string    `json:"status,omitempty" bson:"status,omitempty"`
	CreateAt  time.Time          `json:"created_at,omitempty" bson:"created_at,omitempty"`
	UpdatedAt time.Time          `json:"updated_at,omitempty" bson:"updated_at,omitempty"`
}

type UpdatePost struct {
	Email     string    `json:"email,omitempty" bson:"email,omitempty"`
	Name      string    `json:"name,omitempty" bson:"name,omitempty"`
	Role      string    `json:"role,omitempty" bson:"role,omitempty"`
	Organisation string    `json:"organisation" bson:"organisation"`
	Contact   string    `json:"contact,omitempty" bson:"contact,omitempty"`
	KindofTalk []string    `json:"kind_of_talk,omitempty" bson:"kind_of_talk,omitempty"`
	Title     string    `json:"title,omitempty" bson:"title,omitempty"`
	Description string    `json:"description,omitempty" bson:"description,omitempty"`
	Dates     []string  `json:"dates,omitempty" bson:"dates,omitempty"`
	ExtraDetails string    `json:"extra_details,omitempty" bson:"extra_details,omitempty"`
	Location  string    `json:"location,omitempty" bson:"location,omitempty"`
	Status    string    `json:"status,omitempty" bson:"status,omitempty"`
	CreateAt  time.Time          `json:"created_at,omitempty" bson:"created_at,omitempty"`
	UpdatedAt time.Time          `json:"updated_at,omitempty" bson:"updated_at,omitempty"`
}
