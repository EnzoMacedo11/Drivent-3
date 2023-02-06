import { findHotelRooms, findManyHotels } from "@/repositories/hotels-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";
import { notFoundError } from "@/errors";
import ticketRepository from "@/repositories/ticket-repository";
import { TicketStatus } from "@prisma/client";

export async function Hotels(){
    const hotels = await findManyHotels();
    if(hotels.length === 0) throw notFoundError()  
    return hotels;
}

export async function enrollmentConfirmation(userId:number) {
    const enrollment = await enrollmentRepository.findUserId(userId)
    if(!enrollment) throw notFoundError()    
}

export async function ticketConfirmation(userId:number){
    const enrollment = await enrollmentRepository.findUserId(userId)
    const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id)
    if(!ticket) throw notFoundError()
}

export async function ticketStatusConfirmation(userId:number){
    const enrollment = await enrollmentRepository.findUserId(userId)
    const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id)

    if(ticket.status !== TicketStatus.PAID) throw { error: "ticket not paid"}
    if(ticket.TicketType.isRemote === true) throw {error: "ticket remote"}
    if(ticket.TicketType.includesHotel === false) throw {error: "ticket not include hotel"}
}

export async function Rooms(hotelId:number){
    const Rooms = await findHotelRooms(hotelId);
    if(Rooms.Rooms.length === 0) throw notFoundError()
    return Rooms;
}