package services

import "github.com/acd19ml/EventCOM/models"

type AttendanceService interface {
	CreateAttendance(*models.CreateAttendanceRequest) (*models.DBAttendance, error)
	UpdateAttendance(string, *models.UpdateAttendance) (*models.DBAttendance, error)
	FindAttendanceById(string) (*models.DBAttendance, error)
	FindAttendances(page int, limit int) ([]*models.DBAttendance, error)
	DeleteAttendance(string) error
}