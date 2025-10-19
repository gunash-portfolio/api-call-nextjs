import type { MockSession,MockUser,MockMovie,MockUserFilmRecord } from "../types/test-types";

// Mock next-auth BEFORE any imports that use it
jest.mock('next-auth', () => ({
    __esModule: true,
    default: jest.fn(() => ({
        handlers: {},
        signIn: jest.fn(),
        signOut: jest.fn(),
        auth: jest.fn(),
    })),
}));

jest.mock('@/lib/auth', () => ({
    __esModule: true,
    auth: jest.fn(),
    signIn: jest.fn(),
    signOut: jest.fn(),
    handlers: {},
}));

jest.mock('@/lib/prisma', ()=>({
    __esModule:true,
    default:{
        user:{
            findUnique:jest.fn(),
        },
        userFilms:{
            findMany:jest.fn(),
            findFirst: jest.fn(),
            create: jest.fn(),
        },
        movies:{
            findUnique: jest.fn(),
        },
    },
}));

// Now import after mocks are set up
import { NextRequest } from "next/server";
import { GET,POST } from "@/app/api/user-films/route";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

const mockAuth = auth as jest.Mock;
const mockPrisma = prisma as jest.Mocked<typeof prisma>;

describe('User Films API - GET', ()=>{
    beforeEach(()=>{
        jest.clearAllMocks();
    });
    it('should return 401 if user is not authenticated', async() => {
        mockAuth.mockResolvedValue(null);

        const request = new NextRequest('http://localhost:3000/api/user-films');
        const response = await GET(request);
        const data: {error:string} = await response.json();
        
        expect(response.status).toBe(401);
        expect(data.error).toBe('Unauthorized');
    });
    it('should return 404 if user not found in database', async()=> {
        const mockSession: MockSession = {
            user: { email:'test@example.com', role:'user'},
            expires: new Date(Date.now()+86400000).toISOString(),
        };
        mockAuth.mockResolvedValue(mockSession);
        (mockPrisma.user.findUnique as jest.Mock).mockResolvedValue(null);

        const request = new NextRequest('http://localhost:3000/api/user-films');
        const response = await GET(request);
        const data: {error:string} = await response.json();

        expect(response.status).toBe(404);
        expect(data.error).toBe('User not found');
    });
 it('should return favorite films for authenticated user', async() => {
    const mockSession: MockSession = {
        user: {email: 'test@example.com', role:'user'},
        expires: new Date(Date.now()+86400000).toISOString(),
    };
    mockAuth.mockResolvedValue(mockSession);

    const mockUser:MockUser = {
        id:1,
        email:'test@example.com',
        name:'Test User',
        password:'hashedpassword',
        role:'user',
    };
(mockPrisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

const mockMovie: MockMovie = {
    id:101,
    title:'Test Movie',
    release_date:'2024-01-01',
    imdb_rating:8.5,
};
const mockUserFilm:MockUserFilmRecord = {
    id:1,
    userId:1,
    movieId:101,
    addedAt: new Date('2024-10-01'),
    movie:mockMovie,
};

(mockPrisma.userFilms.findMany as jest.Mock).mockResolvedValue([mockUserFilm]);

const request = new NextRequest('http://localhost:3000/api/user-films');
const response = await GET(request);
const data: Array<{
    id:number;
    title:string;
    release_date:string;
    imdb_rating:number;
    userFilmId:number;
    addedAt:Date;
}> = await response.json();
expect(response.status).toBe(200);
expect(data).toHaveLength(1);
expect(data[0].title).toBe('Test Movie');
expect(data[0].userFilmId).toBe(1);
expect(data[0].imdb_rating).toBe(8.5);
});
it('should return empty array if user has no favorites', async () => {
    const mockSession: MockSession = {
        user:{email: 'test@example.com', role:'user'},
        expires: new Date(Date.now()+86400000).toISOString(),
    };
    mockAuth.mockResolvedValue(mockSession);

    const mockUser:MockUser = {
        id:1,
        email:'test@example.com',
        name:'Test User',
        password:'hashedpassword',
        role:'user',
    };
    (mockPrisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
    (mockPrisma.userFilms.findMany as jest.Mock).mockResolvedValue([]);

    const request = new NextRequest('http://localhost:3000/api/user-films');
    const response = await GET(request);
    const data: unknown[] = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveLength(0);
});   
});

describe('User Films API - POST', ()=>{
    beforeEach(()=>{
        jest.clearAllMocks();
    });

    it('should returnn 401 if not authenticated',async() => {
        mockAuth.mockResolvedValue(null);

        const request = new NextRequest('http://localhost:3000/api/user-films',{
            method:'POST',
            body:JSON.stringify({movieId:101}),
        });
        const response = await POST(request);
        const data: {error:string} = await response.json();

        expect(response.status).toBe(401);
        expect(data.error).toBe('Unauthorized');
    });

    it('should return 400 if movieId is missing', async() =>{
        const mockSession:MockSession = {
            user:{email: 'test@example.com', role:'user'},
            expires:new Date(Date.now()+86400000).toISOString(),
        };
        mockAuth.mockResolvedValue(mockSession);

        const request = new NextRequest('http://localhost:3000/api/user-films', {
            method:'POST',
            body:JSON.stringify({}),
        });
        const response = await POST(request);
        const data: {error:string} = await response.json();

        expect(response.status).toBe(400);
        expect(data.error).toBe('Movie ID is required');
    });

    it('should return 404 if movie does not exist', async() => {
        const mockSession:MockSession = {
            user: {email: 'test@example.com',role:'user'},
            expires:new Date(Date.now()+86400000).toISOString(),
        };
        
        mockAuth.mockResolvedValue(mockSession);

        const mockUser:MockUser = {
            id:1,
            email:'test@example.com',
            name:'Test User',
            password:'hashedpassword',
            role:'user',
        };
        (mockPrisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
        (mockPrisma.movies.findUnique as jest.Mock).mockResolvedValue(null);
        const request = new NextRequest('http://localhost:3000/api/user-films', {
            method:'POST',
            body:JSON.stringify({movieId:999}),
        });
        const response = await POST(request);
        const data: {error: string} = await response.json();

        expect(response.status).toBe(404);
        expect(data.error).toBe('Movie not found');
    });
    it('should add movie to favorites successfully', async()=>{
        const mockSession:MockSession = {
            user:{email: 'test@example.com', role:'user'},
            expires: new Date(Date.now()+86400000).toISOString(),
        };
        mockAuth.mockResolvedValue(mockSession);

        const mockUser: MockUser = {
            id:1,
            email:'test@example.com',
            name:'Test User',
            password:'hashedpassword',
            role:'user',
        };
        (mockPrisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

        const mockMovie: MockMovie = {
            id:101,
            title:'New Movie',
            release_date:'2024-05-15',
            imdb_rating:9.0,
        };

        (mockPrisma.movies.findUnique as jest.Mock).mockResolvedValue(mockMovie);
        (mockPrisma.userFilms.findFirst as jest.Mock).mockResolvedValue(null);
        
        const mockCreatedUserFilm:MockUserFilmRecord = {
            id:1,
            userId:1,
            movieId:101,
            addedAt: new Date(),
            movie:mockMovie,
        };

        (mockPrisma.userFilms.create as jest.Mock).mockResolvedValue(mockCreatedUserFilm);
        const request = new NextRequest('http://localhost:3000/api/user-films', {
            method:'POST',
            body:JSON.stringify({movieId:101}),
        });

        const response = await POST(request);
        const data: {
            id:number;
            title:string;
            userFilmId:number;
            addedAt:Date;

        } = await response.json();

        expect(response.status).toBe(201);
        expect(data.title).toBe('New Movie');
        expect(data.userFilmId).toBe(1);
    });
    it('should return 400 if movie already in favorites', async()=>{
        const mockSession:MockSession = {
            user:{email:'test@example.com', role:'user'},
            expires: new Date(Date.now()+86400000).toISOString(),
        };
        mockAuth.mockResolvedValue(mockSession);

        const mockUser: MockUser = {
            id:1,
            email:'test@example.com',
            name:'Test User',
            password: 'hashedpassword',
            role:'user',
        };
        (mockPrisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

        const mockMovie: MockMovie = {
            id:101,
            title:'Existing Movie',
            release_date:'2024-05-15',
            imdb_rating:9.0,
        };
        (mockPrisma.movies.findUnique as jest.Mock).mockResolvedValue(mockMovie);

        const existingUserFilm:MockUserFilmRecord = {
            id:1,
            userId:1,
            movieId:101,
            addedAt:new Date(),
            movie:mockMovie,
        };
        (mockPrisma.userFilms.findFirst as jest.Mock).mockResolvedValue(existingUserFilm);

        const request = new NextRequest('http://localhost:3000/api/user-films',{
            method:'POST',
            body:JSON.stringify({movieId:101}),
        });

        const response = await POST(request);
        const data: {error:string} = await response.json();

        expect(response.status).toBe(400);
        expect(data.error).toBe('Movie already in favorites');
    });
});



