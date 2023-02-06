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
        await enrollmentConfirmation(userId)
    }catch(e){
        res.status(404).send()
    }

    try{
        await ticketConfirmation(userId)
    }catch(e){
        res.status(404).send()
    }

    try{
        const hotels = await Hotels();
        if(hotels.length === 0) throw notFoundError
        console.log(hotels)
    }catch(e){
        res.status(404).send()
    }


    try{
        await ticketStatusConfirmation(userId)
    }catch(e){
        res.status(402).send()
    }
    
    try{
        const hotels = await Hotels();
        res.send(hotels)
    }catch(e){
        res.status(404).send()
    }
}

export async function getRooms(req:AuthenticatedRequest, res:Response){
    const {userId} = req
    const hotelId = Number(req.params.hotelId);

    try{
        await enrollmentConfirmation(userId)
    }catch(e){
        res.status(404).send()
    }

    try{
        await ticketConfirmation(userId)
    }catch(e){
        res.status(404).send()
    }


    try{
        const RoomId = await Rooms(hotelId);
        if (RoomId.Rooms.length === 0) throw notFoundError()
        console.log(RoomId)
    }catch(e){
        res.status(404).send()
    }


    try{
        await ticketStatusConfirmation(userId)
    }catch(e){
        res.status(402).send()
    }

    try{
        const RoomId = await Rooms(hotelId);  // Isso ta certo?
        res.send(RoomId)
    }catch(e){
        res.status(404).send()
    }
}