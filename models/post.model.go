package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)
//email, name, role, organisation, contact details, kind of talk I like to give, Talk Title, Talk Description, choose Possible dates and extra
type CreatePostRequest struct {
	Email     string    `json:"email,omitempty" bson:"email,omitempty"`
	Name      string    `json:"name,omitempty" bson:"name,omitempty"`
	Role      string    `json:"role,omitempty" bson:"role,omitempty"`
	Organisation string    `json:"organisation,omitempty" bson:"organisation,omitempty"`
	Contact   string    `json:"contact,omitempty" bson:"contact,omitempty"`
	KindofTalk []string    `json:"kind_of_talk,omitempty" bson:"kind_of_talk,omitempty"`
	Title     string    `json:"title,omitempty" bson:"title,omitempty"`
	Description string    `json:"description,omitempty" bson:"description,omitempty"`
	Dates     []string  `json:"dates,omitempty" bson:"dates,omitempty"`
	ExtraDetails string    `json:"extra_details,omitempty" bson:"extra_details,omitempty"`
	Location  string    `json:"location,omitempty" bson:"location,omitempty"`
	Status    string    `json:"status,omitempty" bson:"status,omitempty"`
	Todos       Todo      `json:"todos" bson:"todos"` // Embedding Todos directly
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
	Todos       Todo      `json:"todos,omitempty" bson:"todos,omitempty"` // Embedding Todos directly
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
	Todos       Todo      `json:"todos,omitempty" bson:"todos,omitempty"` // Embedding Todos directly
	CreateAt  time.Time          `json:"created_at,omitempty" bson:"created_at,omitempty"`
	UpdatedAt time.Time          `json:"updated_at,omitempty" bson:"updated_at,omitempty"`
}

// Todo represents a task related to preparing and organizing a talk.
type Todo struct {
	// ID             primitive.ObjectID `json:"id,omitempty" bson:"_id,omitempty"` 
	TitleProposed  bool               `json:"title_proposed" bson:"title_proposed"`
	ContactSpeaker bool               `json:"contact_speaker" bson:"contact_speaker"`
	TimeConfirmed  bool               `json:"time_confirmed" bson:"time_confirmed"`
	VenueBooked    bool               `json:"venue_booked" bson:"venue_booked"`
	WebUpdated     bool               `json:"web_updated" bson:"web_updated"`
	CalenderInvite bool               `json:"calender_invite" bson:"calender_invite"`
}

type UpdateTodoRequest struct {
	// TodoID         string 			  `json:"todoId"`         // Todo项的唯一标识符
	TitleProposed  bool               `json:"title_proposed" bson:"title_proposed"`
	ContactSpeaker bool               `json:"contact_speaker" bson:"contact_speaker"`
	TimeConfirmed  bool               `json:"time_confirmed" bson:"time_confirmed"`
	VenueBooked    bool               `json:"venue_booked" bson:"venue_booked"`
	WebUpdated     bool               `json:"web_updated" bson:"web_updated"`
	CalenderInvite bool               `json:"calender_invite" bson:"calender_invite"`
}


func (c *CreatePostRequest) SetDefaultStatus() {
    if c.Status == "" {
        c.Status = "interested"
    }
}