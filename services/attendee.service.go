package services

import "github.com/acd19ml/EventCOM/models"

type AttendeeService interface {
	CreateAttendee(*models.CreateAttendeeRequest) (*models.DBAttendee, error)
	UpdateAttendee(string, *models.UpdateAttendee) (*models.DBAttendee, error)
	FindAttendeeById(string) (*models.DBAttendee, error)
	FindAttendees(page int, limit int) ([]*models.DBAttendee, error)
	DeleteAttendee(string) error
}