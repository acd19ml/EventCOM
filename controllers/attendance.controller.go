package controllers

import (
	"net/http"
	"strconv"
	
	"github.com/gin-gonic/gin"
	"github.com/acd19ml/EventCOM/models"
	"github.com/acd19ml/EventCOM/services"
)

type AttendanceController struct {
	attendanceService services.AttendanceService
}

func NewAttendanceController(attendanceService services.AttendanceService) AttendanceController {
	return AttendanceController{attendanceService}
}

func (dc *AttendanceController) CreateAttendance(ctx *gin.Context) {
	var attendance models.CreateAttendanceRequest

	if err := ctx.ShouldBindJSON(&attendance); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"status": "fail", "message": err.Error()})
		return
	}

	newAttendance, err := dc.attendanceService.CreateAttendance(&attendance)
	if err != nil {
		ctx.JSON(http.StatusBadGateway, gin.H{"status": "fail", "message": err.Error()})
		return
	}

	ctx.JSON(http.StatusCreated, gin.H{"status": "success", "data": newAttendance})
}

func (dc *AttendanceController) UpdateAttendance(ctx *gin.Context) {
	attendanceId := ctx.Param("attendanceId")

	var attendance models.UpdateAttendance
	if err := ctx.ShouldBindJSON(&attendance); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"status": "fail", "message": err.Error()})
		return
	}

	updatedAttendance, err := dc.attendanceService.UpdateAttendance(attendanceId, &attendance)
	if err != nil {
		ctx.JSON(http.StatusBadGateway, gin.H{"status": "fail", "message": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"status": "success", "data": updatedAttendance})
}

func (dc *AttendanceController) FindAttendanceById(ctx *gin.Context) {
	attendanceId := ctx.Param("attendanceId")

	attendance, err := dc.attendanceService.FindAttendanceById(attendanceId)
	if err != nil {
		ctx.JSON(http.StatusBadGateway, gin.H{"status": "fail", "message": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"status": "success", "data": attendance})
}

func (dc *AttendanceController) FindAttendances(ctx *gin.Context) {
	page, _ := strconv.Atoi(ctx.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(ctx.DefaultQuery("limit", "10"))

	attendances, err := dc.attendanceService.FindAttendances(page, limit)
	if err != nil {
		ctx.JSON(http.StatusBadGateway, gin.H{"status": "fail", "message": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"status": "success", "results": len(attendances), "data": attendances})
}

func (dc *AttendanceController) DeleteAttendance(ctx *gin.Context) {
	attendanceId := ctx.Param("attendanceId")

	err := dc.attendanceService.DeleteAttendance(attendanceId)
	if err != nil {
		ctx.JSON(http.StatusBadGateway, gin.H{"status": "fail", "message": err.Error()})
		return
	}

	ctx.JSON(http.StatusNoContent, nil)
}