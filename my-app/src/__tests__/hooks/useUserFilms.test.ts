import useUserFilms,{FavoriteMovie} from "@/hooks/useUserFilms";
import { renderHook, waitFor,act } from "@testing-library/react";
import { useSession } from "next-auth/react";
import { MockSession,MockFavoriteMovie } from "../types/test-types";

jest.mock('next-auth/react');
const mockUseSession = useSession as jest.MockedFunction<typeof useSession>

global.fetch = jest.fn();
const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>

describe('useUserFilms Hook',()=>{
    beforeEach(()=>{
        jest.clearAllMocks();
    });
it('should initialize with correct default values', ()=>{
    mockUseSession.mockReturnValue({
        data:null,
        status:'loading',
        update:jest.fn()
    });

    const {result} = renderHook(()=>useUserFilms());
    // When status is 'loading' (not authenticated), loading will be set to false
    expect(result.current.loading).toBe(false);
    expect(result.current.favorites).toEqual([]);
    expect(result.current.error).toBeNull();
})    ;
it('should not fetch when user is unauthenticated', async()=>{
    mockUseSession.mockReturnValue({
        data:null,
        status:'unauthenticated',
        update:jest.fn(),
    });
    const {result}=renderHook(()=>useUserFilms());

    await waitFor(()=>{
        expect(result.current.loading).toBe(false);
    });
    expect(mockFetch).not.toHaveBeenCalled();
    expect(result.current.favorites).toEqual([]);
});
it('should fetch favorites when authenticated', async()=>{
    const mockSession:MockSession ={
        user:{email: 'test@example.com',role:'user'},
        expires: new Date(Date.now()+86400000).toISOString(),
    };
    mockUseSession.mockReturnValue({
        data:mockSession,
        status:'authenticated',
        update:jest.fn()
    });
    const mockFavorites:MockFavoriteMovie[]=[
        {
            id:1,
            title:'Favorite Movie',
            release_date:new Date('2024-01-15'),
            imdb_rating:9.0,
            userFilmId:10,
            addedAt:new Date('2024-10-01'),
        },
    ];

    mockFetch.mockResolvedValueOnce({
        ok:true,
        json:async()=>mockFavorites,
    } as Response);
    const {result} = renderHook(()=>useUserFilms());

    await waitFor(()=>{
        expect(result.current.loading).toBe(false);
    });

    expect(mockFetch).toHaveBeenCalledWith('/api/user-films');
    expect(result.current.favorites).toEqual(mockFavorites);
    expect(result.current.error).toBeNull();

});

it('should handle fetch error', async()=>{
    const mockSession:MockSession = {
        user:{email:'test@example.com',role:'user'},
        expires: new Date(Date.now()+86400000).toISOString(),
    };
    mockUseSession.mockReturnValue({
        data:mockSession,
        status:'authenticated',
        update:jest.fn(),
    });
    mockFetch.mockResolvedValueOnce({
        ok:false,
        status:500,
    } as Response);
    
    const {result} = renderHook(()=>useUserFilms());

    await waitFor(()=>{
        expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe('Failed to fetch favorites');
    expect(result.current.favorites).toEqual([]);
});
it('should add favorite successfully', async()=>{
    const mockSession:MockSession = {
        user:{email:'test@example.com', role:'user'},
        expires:new Date(Date.now()+86400000).toISOString(),
    };
    mockUseSession.mockReturnValue({
        data:mockSession,
        status:'authenticated',
        update:jest.fn(),
    });

    mockFetch.mockResolvedValueOnce({
        ok:true,
        json:async()=>[],

    } as Response);
    const {result} = renderHook(()=>useUserFilms());
    await waitFor(()=>{
        expect(result.current.loading).toBe(false);
    });
    const newFavorite:MockFavoriteMovie={
        id:2,
        title:'New Favorite',
        release_date:new Date('2024-05-20'),
        imdb_rating:8.5,
        userFilmId:20,
        addedAt:new Date(),
    };
    mockFetch.mockResolvedValueOnce({
        ok:true,
        json:async () => newFavorite,
    } as Response);

    let addResult: {success:boolean; error?:string} | undefined;

    await act(async()=>{
        addResult = await result.current.addFavorite(2);
    });
    expect(addResult?.success).toBe(true);
    expect(result.current.favorites).toContainEqual(newFavorite);
    expect(mockFetch).toHaveBeenCalledWith('/api/user-films',{
        method:'POST',
        headers:{'Content-Type': 'application/json'},
        body:JSON.stringify({movieId:2}),
    });
});
it('should remove favorite successfully', async()=>{
    const mockSession:MockSession = {
        user:{email:'test@example.com',role:'user'},
        expires:new Date(Date.now()+86400000).toISOString(),
    };

    mockUseSession.mockReturnValue({
        data:mockSession,
        status:'authenticated',
        update:jest.fn(),
    });

    const initialFavorites: MockFavoriteMovie[] = [
        {
            id:1,
            title:'Favorite Movie',
            release_date:new Date('2024-01-15'),
            imdb_rating:9.0,
            userFilmId:10,
            addedAt:new Date('2024-10-01')
        },
    ];
    mockFetch.mockResolvedValueOnce({
        ok:true,
        json:async()=> initialFavorites,
    } as Response);
    const {result} = renderHook(()=>useUserFilms());
    await waitFor(()=>{
        expect(result.current.loading).toBe(false);
    });
    mockFetch.mockResolvedValueOnce({
        ok:true,
        json:async ()=>({message:'Removed'}),
    } as Response);
    let removeResult:{success:boolean; error?:string} | undefined;
    await act(async()=>{
        removeResult = await result.current.removeFavorite(10);
    });
    expect(removeResult?.success).toBe(true);
    expect(result.current.favorites).toHaveLength(0);
    expect(mockFetch).toHaveBeenCalledWith('/api/user-films/10',{
        method:'DELETE',
    });
});
it('should check if movie is favorite correctly', async()=>{
    const mockSession:MockSession = {
        user:{email:'test@example.com', role:'user'},
        expires:new Date(Date.now()+86400000).toISOString(),
    };
    mockUseSession.mockReturnValue({
        data:mockSession,
        status:'authenticated',
        update:jest.fn(),
    });

    const favorites:MockFavoriteMovie[] = [
        {
            id:1,
            title:"Favorite Movie",
            release_date: new Date('2024-01-15'),
            imdb_rating:9.0,
            userFilmId:10,
            addedAt:new Date('2024-10-01'),
        },
    ];
mockFetch.mockResolvedValueOnce({
    ok:true,
    json:async()=>favorites,

} as Response);
const {result} = renderHook(()=>useUserFilms());

await waitFor(()=>{
    expect(result.current.loading).toBe(false);

});
expect(result.current.isFavorite(1)).toBe(true);
expect(result.current.isFavorite(2)).toBe(false);
});
it('should get correct userFilmId', async()=>{
    const mockSession:MockSession = {
        user:{email:'test@example.com', role:'user'},
        expires: new Date(Date.now()+86400000).toISOString(),
    };
    mockUseSession.mockReturnValue({
        data:mockSession,
        status:'authenticated',
        update:jest.fn(),
    });
    const favorites:MockFavoriteMovie[]=[{
        id:1,
        title:'Favorite Movie',
        release_date:new Date('2024-01-15'),
        imdb_rating:9.0,
        userFilmId:10,
        addedAt:new Date('2024-10-01'),
    },];
    mockFetch.mockResolvedValueOnce({
        ok:true,
        json:async() => favorites,
    } as Response);
    const {result} = renderHook(()=> useUserFilms());

    await waitFor(()=>{
        expect(result.current.loading).toBe(false);
    });
    expect(result.current.getFavoriteId(1)).toBe(10);
    expect(result.current.getFavoriteId(2)).toBeUndefined();
    
})




})
