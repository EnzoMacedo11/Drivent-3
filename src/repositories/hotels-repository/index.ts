import { prisma } from "@/config"

export async function findManyHotels(){
     return prisma.hotel.findMany();
}

export async function findHotelRooms(hotelId:number){
     return prisma.hotel.findUnique({
          where:{ id: hotelId
          }, include: {Rooms: true}
     })
}