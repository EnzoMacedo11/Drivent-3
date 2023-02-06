import { Request, Response } from "express";
import httpStatus from "http-status";
import { enrollmentConfirmation, Hotels, Rooms, ticketConfirmation, ticketStatusConfirmation } from "@/services";
import { findManyHotels } from "@/repositories/hotels-repository";
import { AuthenticatedRequest } from "@/middlewares";
import { notFoundError } from "@/errors";


export async function getHotels(req:AuthenticatedRequest, res:Response) {
    const {userId} = req
    //console.log({userId})

    try{
        const hotels = await Hotels();
        await enrollmentConfirmation(userId)
        await ticketConfirmation(userId)
        await ticketStatusConfirmation(userId)

        //if(hotels.length === 0) throw notFoundError
        console.log(hotels)
        res.send(hotels)
    }catch(e){
        if(e.name ==="NotFoundError"){
            return res.status(404).send()}
        return res.status(402).send()
    }
}

export async function getRooms(req:AuthenticatedRequest, res:Response){
    const {userId} = req
    const hotelId = Number(req.params.hotelId);

    try{
        const RoomId = await Rooms(hotelId);
        await enrollmentConfirmation(userId)
        await ticketConfirmation(userId)
        await ticketStatusConfirmation(userId)
        
       // if (RoomId.Rooms.length === 0) throw notFoundError
        console.log(RoomId)
        res.send(RoomId)
    }catch(e){
        if(e.name ==="NotFoundError"){
            return res.status(404).send()}
        return res.status(402).send()
        
    }
}
