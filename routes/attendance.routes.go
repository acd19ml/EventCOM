package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/acd19ml/EventCOM/controllers"
	"github.com/acd19ml/EventCOM/middleware"
	"github.com/acd19ml/EventCOM/services"
)

type AttendanceRouteController struct {
	attendanceController controllers.AttendanceController
}

func NewAttendanceControllerRoute(attendanceController controllers.AttendanceController) AttendanceRouteController {
	return AttendanceRouteController{attendanceController}
}

func (r *AttendanceRouteController) AttendanceRoute(rg *gin.RouterGroup, userService services.UserService) {
	router := rg.Group("/attendances")
	router.POST("/", r.attendanceController.CreateAttendance)
	router.Use(middleware.DeserializeUser(userService))
	router.GET("/", r.attendanceController.FindAttendances)
	router.GET("/post/:postId", r.attendanceController.FindAttendanceByPostId)
	router.GET("/id/:attendanceId", r.attendanceController.FindAttendanceById)
	router.PATCH("/:attendanceId", r.attendanceController.UpdateAttendance)
	router.DELETE("/:attendanceId", r.attendanceController.DeleteAttendance)
}