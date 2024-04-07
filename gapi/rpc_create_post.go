package gapi

import (
	"context"
	"strings"

	"github.com/wpcodevo/golang-mongodb/models"
	"github.com/wpcodevo/golang-mongodb/pb"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
	"google.golang.org/protobuf/types/known/timestamppb"
)

func (postServer *PostServer) CreatePost(ctx context.Context, req *pb.CreatePostRequest) (*pb.PostResponse, error) {

	post := &models.CreatePostRequest{
		Email:    req.GetEmail(),
		Name:     req.GetName(),
		Role:     req.GetRole(),
		Organisation: req.GetOrganisation(),
		Contact: req.GetContact(),
		KindofTalk: req.GetKindofTalk(),
		Title:    req.GetTitle(),
		Description:  req.GetDescription(),
		Dates:    req.GetDates(),
		ExtraDetails: req.GetExtraDetails(),
		Location: req.GetLocation(),
		Status:   req.GetStatus(),
	}

	newPost, err := postServer.postService.CreatePost(post)

	if err != nil {
		if strings.Contains(err.Error(), "title already exists") {
			return nil, status.Errorf(codes.AlreadyExists, err.Error())
		}

		return nil, status.Errorf(codes.Internal, err.Error())
	}

	res := &pb.PostResponse{
		Post: &pb.Post{
			Id:        newPost.Id.Hex(),
			Email:     newPost.Email,
			Name:      newPost.Name,
			Role:      newPost.Role,
			Organisation : newPost.Organisation,
			Contact:  newPost.Contact,
			KindofTalk: newPost.KindofTalk,
			Title:     newPost.Title,
			Description: newPost.Description,
			Dates:     newPost.Dates,
			ExtraDetails: newPost.ExtraDetails,
			Location:  newPost.Location,
			Status:    newPost.Status,
			CreatedAt: timestamppb.New(newPost.CreateAt),
			UpdatedAt: timestamppb.New(newPost.UpdatedAt),
		},
	}
	return res, nil
}
