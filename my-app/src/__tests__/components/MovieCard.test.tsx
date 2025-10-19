import React from "react";
import {render,screen, fireEvent} from '@testing-library/react'
import { useSession } from "next-auth/react";
import MovieCard from "@/components/MovieCard";
import { Movie } from "@/types/movie";
import type { MockSession } from "../types/test-types";

jest.mock('next/link', () =>{
    return ({children, href}: {children: React.ReactNode; href: string})=>{
        return <a href={href}>{children}</a>
    };
});

jest.mock('next-auth/react');
const mockUseSession = useSession as jest.MockedFunction<typeof useSession>;
describe('MovieCard Component', ()=>{
    const mockMovie:Movie = {
        id:1,
        title:'Test Movie',
        release_date:'2024-01-15',
        imdb_rating:8.5,
    };

    beforeEach(()=>{
        jest.clearAllMocks();
    });

    it('should render movie information correctly', ()=>{
        mockUseSession.mockReturnValue({
            data:null,
            status:'unauthenticated',
            update:jest.fn(),
        });

        render(<MovieCard movie={mockMovie}/>);

        expect(screen.getByText('Test Movie')).toBeInTheDocument();
        expect(screen.getByText('Rating:')).toBeInTheDocument();
        expect(screen.getByText('8.5/10')).toBeInTheDocument();
    });

    it('should render release date in correct format', ()=>{
        mockUseSession.mockReturnValue({
            data:null,
            status:'unauthenticated',
            update:jest.fn(),
        });

        render(<MovieCard movie={mockMovie}/>);

        const dateElement = screen.getByText(/Released:/);
        expect(dateElement).toBeInTheDocument();
    });
    it('should not show favorite button when user is not authenticated', ()=>{
        mockUseSession.mockReturnValue({
            data:null,
            status:'unauthenticated',
            update:jest.fn(),
        });

        const mockOnToggle = jest.fn<void, [number]>();
        render (<MovieCard movie={mockMovie} onToggleFavorite={mockOnToggle}/>)

        const buttons = screen.queryAllByRole('button');
        expect(buttons).toHaveLength(0);
    });

    it('should show favorite button when user is authenticated',()=>{
        const mockSession:MockSession ={
            user:{email:'test@example.com',role:'user'},
            expires:new Date(Date.now()+86400000).toISOString(),
        };
        mockUseSession.mockReturnValue({
            data:mockSession,
            status:'authenticated',
            update:jest.fn(),
        });
        
        const mockOnToggle = jest.fn<void,[number]>();
        render(<MovieCard movie={mockMovie} onToggleFavorite={mockOnToggle} isFavorite={false}/>)

        const button = screen.getByRole('button');
        expect(button).toBeInTheDocument();
        expect(button).toHaveAttribute('title', 'Add to favorites');
    });
    it('should call onToggleFavorite with correct movieId when clicked', ()=>{
        const mockSession:MockSession ={
            user:{email:'test@example.com',role:'user'},
            expires: new Date(Date.now()+86400000).toISOString(),
        };
        mockUseSession.mockReturnValue({
            data:mockSession,
            status:'authenticated',
            update:jest.fn(),
        });
        const mockOnToggle = jest.fn<void,[number]>();
        render(<MovieCard movie={mockMovie} onToggleFavorite={mockOnToggle} isFavorite={false}/>);
        const button = screen.getByRole('button');
        fireEvent.click(button);
        expect(mockOnToggle).toHaveBeenCalledTimes(1);
        expect(mockOnToggle).toHaveBeenCalledWith(1);
    });
    it('should show correct icon when movie is favorite',() =>{
        const mockSession:MockSession = {
            user:{email:'test@example.com',role:'user'},
            expires: new Date(Date.now()+86400000).toISOString(),
        };
        mockUseSession.mockReturnValue({
            data:mockSession,
            status:'authenticated',
            update:jest.fn(),
        });
        const mockOnToggle = jest.fn<void,[number]>();
        render(<MovieCard movie={mockMovie} onToggleFavorite={mockOnToggle} isFavorite={true}/>)

        const button = screen.getByRole('button');
        expect(button).toHaveAttribute('title', 'Remove from favorites');
        expect(button.textContent).toContain('❤️');
    });
    it('should disable button whenn isToggling is true', ()=>{
        const mockSession:MockSession = {
            user:{email:'test@example.com',role:'user'},
            expires: new Date(Date.now()+86400000).toISOString(),
        };
        mockUseSession.mockReturnValue({
            data:mockSession,
            status:'authenticated',
            update:jest.fn(),
        });
        const mockOnToggle = jest.fn<void,[number]>();
        render(<MovieCard movie={mockMovie} onToggleFavorite={mockOnToggle} isFavorite={false} isToggling={true}/>);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button.textContent).toContain('⏳');
    });
    it('should render link to movie detail page',()=>{
        mockUseSession.mockReturnValue({
            data:null,
            status:'unauthenticated',
            update:jest.fn(),
        });

        render(<MovieCard movie={mockMovie} />);
        const link = screen.getByRole('link');
        expect(link).toHaveAttribute('href','/movies/1');
    });

});