import app, { init } from "@/app";
import httpStatus from "http-status";
import supertest from "supertest";
import { cleanDb, generateValidToken } from "../helpers";
import faker from "@faker-js/faker";
import { createUser, createEnrollmentWithAddress, createTicket, createTicketType, createHotel, createTicketnotIncludeHotel, createTicketisRemote, createTicketValid, createRoom, createTicketnotIncludeHotelandRemote } from "../factories";
import { TicketStatus } from "@prisma/client";

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await cleanDb();
});

const server = supertest(app);

describe("GET /hotels", () =>{

    it("Should respond with status 401 if no token", async() =>{
        const result = await server.get("/hotels")
         expect(result.status).toBe(401)
        //console.log(result)
    })

    it("Should respond with status 401 if invalid token", async() =>{
      const token = faker.lorem.word();

        const result =  await server.get("/hotels").set("Authorization",`Bearer ${token}`);
         expect(result.status).toBe(401)
        //console.log(result)
    })

    it("Should respond with status 404 if valid token without enrollment,ticket or hotel", async() =>{
      const token = await generateValidToken()

        const result =  await server.get("/hotels").set("Authorization",`Bearer ${token}`);
         expect(result.status).toBe(404)
        //console.log(result)
    })

    it("Should respond with status 404 if valid token,enrollment without ticket or hotel", async() =>{
      const user = await createUser()
      await createEnrollmentWithAddress(user)
      const token = await generateValidToken(user)

        const result =  await server.get("/hotels").set("Authorization",`Bearer ${token}`);
         expect(result.status).toBe(404)
        //console.log(result)
    })
    
    it("Should respond with status 404 if valid token,enrollment, ticket without hotel", async() =>{
      const user = await createUser()
      //const hotel = await createHotel() 
      const enrollment = await createEnrollmentWithAddress(user)
      const ticketType = await createTicketType()
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED)
      const token = await generateValidToken(user)

        const result =  await server.get("/hotels").set("Authorization",`Bearer ${token}`);
         expect(result.status).toBe(404)
        //console.log(result)
        
    })
    
    it("Should respond with status 402 if valid token,enrollment, ticket and hotel but not paid, isremote and notIncludeHotel", async() =>{
      const user = await createUser()
      const hotel = await createHotel() 
      const enrollment = await createEnrollmentWithAddress(user)
      const ticketType = await createTicketType()
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED)
      const token = await generateValidToken(user)

        const result =  await server.get("/hotels").set("Authorization",`Bearer ${token}`);
         expect(result.status).toBe(402)
        //console.log(result)
    })

    it("Should respond with status 402 if valid token,enrollment, ticket paid and hotel but isremote and notIncludeHotel", async() =>{
      const user = await createUser()
      const hotel = await createHotel() 
      const enrollment = await createEnrollmentWithAddress(user)
      const ticketType = await createTicketnotIncludeHotelandRemote()
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID)
      const token = await generateValidToken(user)

        const result =  await server.get("/hotels").set("Authorization",`Bearer ${token}`);
         expect(result.status).toBe(402)
        //console.log(result)
    })


    it("Should respond with status 402 if valid token,enrollment, ticket paid and hotel but notIncludeHotel", async() =>{
      const user = await createUser()
      const hotel = await createHotel() 
      const enrollment = await createEnrollmentWithAddress(user)
      const ticketType = await createTicketnotIncludeHotel()
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID)
      const token = await generateValidToken(user)

        const result =  await server.get("/hotels").set("Authorization",`Bearer ${token}`);
         expect(result.status).toBe(402)
        //console.log(result)
    })

    it("Should respond with status 402 if valid token,enrollment, ticket paid and hotel but isremote", async() =>{
      const user = await createUser()
      const hotel = await createHotel() 
      const enrollment = await createEnrollmentWithAddress(user)
      const ticketType = await createTicketisRemote()
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID)
      const token = await generateValidToken(user)

        const result =  await server.get("/hotels").set("Authorization",`Bearer ${token}`);
         expect(result.status).toBe(402)
        //console.log(result)
    })

    it("Should respond with status 200 if valid token,enrollment, ticket VALID and hotel", async() =>{
      const user = await createUser()
      const hotel = await createHotel() 
      const enrollment = await createEnrollmentWithAddress(user)
      const ticketType = await createTicketValid()
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID)
      const token = await generateValidToken(user)

        const result =  await server.get("/hotels").set("Authorization",`Bearer ${token}`);
         expect(result.status).toBe(200)
         expect(result.body).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
            id:expect.any(Number),
            name:expect.any(String),
            image:expect.any(String),
            createdAt:expect.any(String),
            updatedAt:expect.any(String)
          })]
            
          )
         )
        console.log(result.body)
    })
    
})






describe("GET /hotels/:id", () =>{

  it("Should respond with status 401 if no token", async() =>{
      
      const result = await server.get("/hotels/1")
       expect(result.status).toBe(401)
      //console.log(result)
  })

  it("Should respond with status 401 if invalid token", async() =>{
    const token = faker.lorem.word();

      const result =  await server.get("/hotels/1").set("Authorization",`Bearer ${token}`);
       expect(result.status).toBe(401)
      //console.log(result)
  })

  it("Should respond with status 404 if valid token without enrollment,ticket or room", async() =>{
    const token = await generateValidToken()
    const hotel = await createHotel()

      const result =  await server.get(`/hotels/${hotel.id}`).set("Authorization",`Bearer ${token}`);
       expect(result.status).toBe(404)
      //console.log(result)
  })

  it("Should respond with status 404 if valid token,enrollment without ticket or room", async() =>{
    const user = await createUser()
    const hotel = await createHotel()
    await createEnrollmentWithAddress(user)
    const token = await generateValidToken(user)

      const result =  await server.get(`/hotels/${hotel.id}`).set("Authorization",`Bearer ${token}`);
       expect(result.status).toBe(404)
      //console.log(result)
  })
  
  it("Should respond with status 404 if valid token,enrollment, ticket without room", async() =>{
    const user = await createUser()
    const hotel = await createHotel()
    //const room = await createRoom(hotel.id)
    const enrollment = await createEnrollmentWithAddress(user)
    const ticketType = await createTicketType()
    const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED)
    const token = await generateValidToken(user)

      const result =  await server.get(`/hotels/${hotel.id}`).set("Authorization",`Bearer ${token}`);
       expect(result.status).toBe(404)
       //console.log(hotel)
       //console.log(room)
      //console.log(result)
  
      
  })
  
  it("Should respond with status 402 if valid token,enrollment, ticket and room but not paid, isremote and notIncludeHotel", async() =>{
    const user = await createUser()
    const hotel = await createHotel()
    const room = await createRoom(hotel.id)
    const enrollment = await createEnrollmentWithAddress(user)
    const ticketType = await createTicketType()
    const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED)
    const token = await generateValidToken(user)

      const result =  await server.get(`/hotels/${hotel.id}`).set("Authorization",`Bearer ${token}`);
       expect(result.status).toBe(402)
      console.log(hotel)
      //console.log(room)
  })

  it("Should respond with status 402 if valid token,enrollment, ticket paid and hotel but isremote and notIncludeHotel", async() =>{
    const user = await createUser()
    const hotel = await createHotel()
    const room = await createRoom(hotel.id) 
    const enrollment = await createEnrollmentWithAddress(user)
    const ticketType = await createTicketnotIncludeHotelandRemote()
    const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID)
    const token = await generateValidToken(user)

      const result =  await server.get(`/hotels/${hotel.id}`).set("Authorization",`Bearer ${token}`);
       expect(result.status).toBe(402)
      //console.log(result)
  })


  it("Should respond with status 402 if valid token,enrollment, ticket paid and hotel but notIncludeHotel", async() =>{
    const user = await createUser()
    const hotel = await createHotel() 
    const room = await createRoom(hotel.id) 
    const enrollment = await createEnrollmentWithAddress(user)
    const ticketType = await createTicketnotIncludeHotel()
    const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID)
    const token = await generateValidToken(user)

      const result =  await server.get(`/hotels/${hotel.id}`).set("Authorization",`Bearer ${token}`);
       expect(result.status).toBe(402)
      //console.log(result)
  })

  it("Should respond with status 402 if valid token,enrollment, ticket paid and hotel but isremote", async() =>{
    const user = await createUser()
    const hotel = await createHotel()
    const room = await createRoom(hotel.id) 
    const enrollment = await createEnrollmentWithAddress(user)
    const ticketType = await createTicketisRemote()
    const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID)
    const token = await generateValidToken(user)

      const result =  await server.get(`/hotels/${hotel.id}`).set("Authorization",`Bearer ${token}`);
       expect(result.status).toBe(402)
      //console.log(result)
  })

  it("Should respond with status 200 if valid token,enrollment, ticket VALID and hotel", async() =>{
    const user = await createUser()
    const hotel = await createHotel() 
    const room = await createRoom(hotel.id) 
    const enrollment = await createEnrollmentWithAddress(user)
    const ticketType = await createTicketValid()
    const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID)
    const token = await generateValidToken(user)

      const result =  await server.get(`/hotels/${hotel.id}`).set("Authorization",`Bearer ${token}`);
       expect(result.status).toBe(200)
       expect(result.body).toEqual(
        {
  id: hotel.id,
  name: hotel.name,
  image: hotel.image,
  createdAt:expect.any(String),
  updatedAt:expect.any(String),
  Rooms: [
    {
      id: room.id,
      name: room.name,
      capacity: room.capacity,
      hotelId: room.hotelId,
      createdAt:expect.any(String),
      updatedAt:expect.any(String)
    }]
          
  })
      
  })
  
})