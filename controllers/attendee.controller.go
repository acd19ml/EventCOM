package controllers

import (
	"net/http"
	"strconv"
	
	"github.com/gin-gonic/gin"
	"github.com/acd19ml/EventCOM/models"
	"github.com/acd19ml/EventCOM/services"
)

type AttendeeController struct {
	attendeeService services.AttendeeService
}

func NewAttendeeController(attendeeService services.AttendeeService) AttendeeController {
	return AttendeeController{attendeeService}
}

func (dc *AttendeeController) CreateAttendee(ctx *gin.Context) {
	var attendee models.CreateAttendeeRequest

	if err := ctx.ShouldBindJSON(&attendee); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"status": "fail", "message": err.Error()})
		return
	}

	newAttendee, err := dc.attendeeService.CreateAttendee(&attendee)
	if err != nil {
		ctx.JSON(http.StatusBadGateway, gin.H{"status": "fail", "message": err.Error()})
		return
	}

	ctx.JSON(http.StatusCreated, gin.H{"status": "success", "data": newAttendee})
}

func (dc *AttendeeController) UpdateAttendee(ctx *gin.Context) {
	attendeeId := ctx.Param("attendeeId")

	var attendee models.UpdateAttendee
	if err := ctx.ShouldBindJSON(&attendee); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"status": "fail", "message": err.Error()})
		return
	}

	updatedAttendee, err := dc.attendeeService.UpdateAttendee(attendeeId, &attendee)
	if err != nil {
		ctx.JSON(http.StatusBadGateway, gin.H{"status": "fail", "message": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"status": "success", "data": updatedAttendee})
}

func (dc *AttendeeController) FindAttendeeById(ctx *gin.Context) {
	attendeeId := ctx.Param("attendeeId")

	attendee, err := dc.attendeeService.FindAttendeeById(attendeeId)
	if err != nil {
		ctx.JSON(http.StatusBadGateway, gin.H{"status": "fail", "message": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"status": "success", "data": attendee})
}

func (dc *AttendeeController) FindAttendees(ctx *gin.Context) {
	page, _ := strconv.Atoi(ctx.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(ctx.DefaultQuery("limit", "500"))

	attendees, err := dc.attendeeService.FindAttendees(page, limit)
	if err != nil {
		ctx.JSON(http.StatusBadGateway, gin.H{"status": "fail", "message": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"status": "success", "results": len(attendees), "data": attendees})
}

func (dc *AttendeeController) DeleteAttendee(ctx *gin.Context) {
	attendeeId := ctx.Param("attendeeId")

	err := dc.attendeeService.DeleteAttendee(attendeeId)
	if err != nil {
		ctx.JSON(http.StatusBadGateway, gin.H{"status": "fail", "message": err.Error()})
		return
	}

	ctx.JSON(http.StatusNoContent, nil)
}
