import { Session } from "next-auth";
import { Movie } from "@/types/movie";
import { FavoriteMovie } from "@/hooks/useUserFilms";

export interface MockSession extends Session{
    user:{
        email:string;
        name?:string | null;
        image?:string | null;
        role:string;
    };
}

export interface MockMovie extends Movie {
    id:number;
    title:string;
    release_date:string;
    imdb_rating:number;
}

export interface MockFavoriteMovie extends FavoriteMovie{
    id:number;
    title:string;
    release_date:Date;
    imdb_rating:number;
    userFilmId:number;
    addedAt:Date;
}
export interface MockUserFilmRecord{
    id:number;
    userId:number;
    movieId:number;
    addedAt:Date;
    movie:MockMovie;
}

export interface MockUser{
    id:number;
    email:string;
    name:string | null;
    password:string;
    role:string;
}
