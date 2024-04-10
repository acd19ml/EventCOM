package services

import "github.com/acd19ml/EventCOM/models"

type DateService interface {
	CreateDate(*models.CreateDateRequest) (*models.DBDate, error)
	UpdateDate(string, *models.UpdateDate) (*models.DBDate, error)
	FindDateById(string) (*models.DBDate, error)
	FindDates(page int, limit int) ([]*models.DBDate, error)
	DeleteDate(string) error
}