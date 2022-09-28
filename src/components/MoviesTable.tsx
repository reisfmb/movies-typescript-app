import { useState } from 'react';
import MovieJson from '../data/movies.json';
import { Column, DataTable, Filter, Sort, SortDirection, Transform } from "./DataTable";
import { Dialog } from './Dialog';
import classes from './MoviesTable.module.scss';
import { ImStarFull, ImStarHalf, ImStarEmpty } from 'react-icons/im';
import { FiArrowLeft } from 'react-icons/fi';
import { FaPaperPlane } from 'react-icons/fa';
import { BiMovie, BiCalendarAlt } from 'react-icons/bi';
import { MdAttachMoney, MdOutlineKeyboardArrowUp, MdOutlineKeyboardArrowDown } from 'react-icons/md';
import { TbClock, TbListSearch } from 'react-icons/tb';

import { debounce } from 'lodash';

interface Movie {
    actors: Array<string>
    description: string
    director: string
    genre: Array<string>
    metascore: number
    rank: number
    rating: number
    revenue: number
    runtime: number
    title: string
    votes: number
    year: number
}

const MOVIES: Array<Movie> = MovieJson.map(movie => ({
    ...movie,
    metascore: parseInt(movie.metascore),
    rank: parseInt(movie.rank),
    rating: parseFloat(movie.rating),
    revenue: movie.revenue ? parseInt(movie.revenue) : 0,
    runtime: parseInt(movie.runtime),
    votes: parseInt(movie.votes),
    year: parseInt(movie.year),
}));

const MOVIES_COLUMNS: Array<Column<Movie>> = [
    { accessor: 'title', view: <><BiMovie/> {'Title'}</> },
    { accessor: 'year', view: <><BiCalendarAlt/> {'Year'}</> },
    { accessor: 'runtime', view: <><TbClock/> {'Runtime'}</> },
    { accessor: 'revenue', view: <><MdAttachMoney/> {'Revenue'}</> },
    { accessor: 'rating', view: <><ImStarEmpty/> {'Rating'}</> },
    { accessor: 'genre', view: <><TbListSearch/> {'Genres'}</> },
]

const MOVIES_TRANSFORMATIONS: Array<Transform<Movie>> = [
    { accessor: 'rating', transform: transformRatingToString },
    { accessor: 'revenue', transform: transformRevenueToString },
    { accessor: 'runtime', transform: transformRuntimeToString },
    { accessor: 'genre', transform: transformGenreToString },
]

const MOVIES_FILTERS: Array<Filter<Movie>> = [
    { accessor: 'title', filter: filterByTitle, input: { type: 'text', placeholder: 'Filter by Title' } },
    { accessor: 'genre', filter: filterByGenre, input: { type: 'select', placeholder: 'Filter by Genre', options: getMoviesGenresOptions(MOVIES) } },
    { accessor: 'year', filter: filterByYear, input: { type: 'select', placeholder: 'Filter by year', options: getMoviesYearsOptions(MOVIES) } },
    { accessor: 'rating', filter: filterByRating, input: { type: 'select', placeholder: 'Above', options: getMoviesRatingsOptions() } }
];

const MOVIES_SORTING: Array<Sort<Movie>> = [
    { accessor: 'title', sort: sortString },
    { accessor: 'year', sort: sortNumber },
    { accessor: 'runtime', sort: sortNumber },
    { accessor: 'revenue', sort: sortNumber },
    { accessor: 'rating', sort: sortNumber },
]

function MoviesTable() {
    const [ movieToInspect, setMovieToInspect ] = useState({} as Movie);
    const [ showDialog, setShowDialog ] = useState(false);
    const [ scrollReachedBottom, setScrollReachedBottom] = useState(false);

    function MOVIES_ON_ROW_CLICK(movie: Movie) {
        setMovieToInspect(movie);
        setShowDialog(true);
    }

    function handleTableWrapScroll(e: any) {
        const scrollableElement = e.target as HTMLDivElement;
        const reachedBottom = scrollableElement.scrollHeight - scrollableElement.scrollTop === scrollableElement.clientHeight;

        if(reachedBottom) {
            setScrollReachedBottom(reachedBottom);
            setTimeout(() => setScrollReachedBottom(false), 100);
        }
    }

    return <div className={classes.movies}>

        {/* MOVE TO ANOTHER COMPONENT */}
        <Dialog show={showDialog}>
            <MoviesComments movie={movieToInspect} closeFn={() => setShowDialog(false)} />
        </Dialog>

        <div className={classes.movies__tableWrap} onScroll={debounce(handleTableWrapScroll, 200)}>
            {
                DataTable<Movie>({
                    CONFIG: {
                        SHOW_ALL_ITEMS: false,
                        ICONS: { ASC: <MdOutlineKeyboardArrowUp/>, DESC: <MdOutlineKeyboardArrowDown/> },
                        NUM_ITEMS_TO_SHOW_INITTIALY: 20,
                        NUM_ITEMS_TO_INCREASE_PER_SCROLL: 10,
                        SCROLL_REACHED_BOTTOM_STATE: scrollReachedBottom,
                    },
                    DATA: MOVIES,
                    COLUMNS: MOVIES_COLUMNS,
                    TRANSFORMATIONS: MOVIES_TRANSFORMATIONS,
                    FILTERS: MOVIES_FILTERS,
                    SORTS: MOVIES_SORTING,
                    onRowClick: MOVIES_ON_ROW_CLICK
                })
            }
        </div>
    </div>
}



{/* MOVE TO ANOTHER COMPONENT */}
function MoviesComments(props: { movie: Movie, closeFn: Function}) {
    return <div className={classes.movies__comments}>
        <header>
            <button onClick={() => props.closeFn()}>
                <FiArrowLeft/>
            </button>

            <h1> {props.movie.title} Comments</h1>
        </header>
        
        <ul>
            { props.movie.actors.map(actor => <li>{ actor }</li>) }
        </ul>

        <footer>
            <input type="text" />
            <button>
                <FaPaperPlane/>
            </button>
        </footer>
    </div>;
}

export { MoviesTable }

// Helper functions

function getMoviesGenresOptions(movies: Array<Movie>) {
    const set = new Set();
    movies.forEach(({genre}) => genre.forEach(t => set.add(t)));
    return ((Array.from(set).map(genre => ({ text: genre, value: genre }))) as Array<{text: string, value: string}>)
        .sort((a,b) => a.text.localeCompare(b.text));
        
}

function getMoviesYearsOptions(movies: Array<Movie>) {
    return Array.from(new Set(movies.map(({year}) => year))).map(year => ({ text: year.toString(), value: year.toString() }))
        .sort((a,b) => a.text.localeCompare(b.text));
}

function getMoviesRatingsOptions() {
    return Array.from(new Array(9), (_, i) => ({ text: (i+1).toString(), value: (i+1).toString() }));
}

function transformRatingToString(rating: number) {
    const numberOfFullStars = Math.floor(rating / 2);
    const numberOfHalfStars = Math.floor(rating % 2);
    const numberOfEmptyStarts = 5 - (numberOfFullStars + numberOfHalfStars);

    const ratingText = `${rating}/10`;

    return <div title={ratingText}>
        { Array.from(new Array(numberOfFullStars), (_) => <ImStarFull />) }
        { Array.from(new Array(numberOfHalfStars), (_) => <ImStarHalf />) }
        { Array.from(new Array(numberOfEmptyStarts), (_) => <ImStarEmpty />) }
    </div>;
}

function transformRevenueToString(revenue: number) {
    const str = revenue ? `$${revenue} M` : ' --- ';
    return <>{str}</>;
}

function transformRuntimeToString(runtime: number) {
    if (runtime < 60) {
        return <>{`${runtime}m`}</>;
    }

    const hours = Math.floor(runtime / 60);
    const minutes = Math.floor(runtime % 60);

    return <>{`${hours}h ${minutes}m`}</>;
}

function transformGenreToString(genres: Array<string>) {
    return <>{genres.join(', ')}</>;
}

function filterByTitle(movie: Movie, typedTitle: string) {
    return movie.title.toLowerCase().includes(typedTitle.toLowerCase());
}

function filterByGenre(movie: Movie, selectedGenre: string) {
    return movie.genre.some((genre: string) => genre === selectedGenre);
}

function filterByYear(movie: Movie, selectedYear: string) {
    return movie.year.toString() === selectedYear;
}

function filterByRating(movie: Movie, minRating: string) {
    return movie.rating > parseInt(minRating);
}

function sortString(accessor: keyof Movie, direction: SortDirection, a: Movie, b: Movie) {
    const multiplier = direction === 'ASC' ? 1 : -1;

    return multiplier * (a[accessor] as string).localeCompare(b[accessor] as string);
}

function sortNumber(accessor: keyof Movie, direction: SortDirection, a: Movie, b: Movie) {
    const multiplier = direction === 'ASC' ? 1 : -1;

    return multiplier * ((a[accessor] as number) - (b[accessor] as number));
}
