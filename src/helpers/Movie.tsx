import { Movie } from '../components/MoviesTable';
import { SortDirection } from '../components/DataTable/DataTable';
import { ImStarEmpty, ImStarFull, ImStarHalf } from 'react-icons/im';

function transformRating(rating: number) {
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

function transformRevenue(revenue: number) {
    const str = revenue ? `$${revenue} M` : ' --- ';
    return <>{str}</>;
}

function transformRuntime(runtime: number) {
    if (runtime < 60) {
        return <>{`${runtime}m`}</>;
    }

    const hours = Math.floor(runtime / 60);
    const minutes = Math.floor(runtime % 60);

    return <>{`${hours}h ${minutes}m`}</>;
}

function transformGenre(genres: Array<string>) {
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

function filterByRuntime(movie: Movie, selectedRange: `${string},${string}`) {
    const [min, max] = selectedRange.split(',').map(n => Number(n));
    return min <= movie.runtime && movie.runtime <= max;
}

function filterByRevenue(movie: Movie, selectedRange: `${string},${string}`) {
    const [min, max] = selectedRange.split(',').map(n => Number(n));
    return min <= movie.revenue && movie.revenue <= max;
}

function filterByRating(movie: Movie, minRating: string) {
    return movie.rating > parseInt(minRating);
}

// TODO: fix any typing
function sortString(accessor: string, direction: SortDirection, a: Movie, b: Movie) {
    const multiplier = direction === 'ASC' ? 1 : -1;
    return multiplier * ((a as any)[accessor] as string).localeCompare((b as any)[accessor] as string);
}

// TODO: fix any typing
function sortNumber(accessor: string, direction: SortDirection, a: Movie, b: Movie) {
    const multiplier = direction === 'ASC' ? 1 : -1;
    return multiplier * (((a as any)[accessor] as number) - ((b as any)[accessor] as number));
}

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

function getMoviesRuntimeOptions(movies: Array<Movie>) {
    return numericalOptionsRangeHelper(movies, 'runtime', 30).map(item => ({
        text: `${transformRuntime(item.min).props.children} to ${transformRuntime(item.max).props.children}`,
        value: `${item.min}, ${item.max}`,
    }));
}

function getMoviesRevenueOptions(movies: Array<Movie>) {
    return numericalOptionsRangeHelper(movies, 'revenue', 100).map(item => ({
        text: `${item.min} to ${item.max}`,
        value: `${item.min}, ${item.max}`,
    }));
}


function getMoviesRatingsOptions() {
    return Array.from(new Array(9), (_, i) => ({ text: (i+1).toString(), value: (i+1).toString() }));
}

function numericalOptionsRangeHelper(movies: Array<Movie>, key: keyof Movie, step: number) {
    const sortedMovies = movies.sort((a,b) => sortNumber(key, 'ASC', a, b));
    const min = sortedMovies[0][key];
    const max = sortedMovies[sortedMovies.length - 1][key];
    const numOfOptions = Math.ceil(Number(max) / step);

    return Array.from(new Array(numOfOptions), (_, i) => ({
        min: i * step,
        max: (i + 1) * step
    })).filter((option) => min <= option.max);
}

const TRANSFORMS = {
    transformRating,
    transformRevenue,
    transformRuntime,
    transformGenre
};

const FILTERS = {
    filterByTitle,
    filterByGenre,
    filterByYear,
    filterByRuntime,
    filterByRevenue,
    filterByRating
};

const SORTS = {
    sortString,
    sortNumber
};

const GET_OPTIONS = {
    getMoviesGenresOptions,
    getMoviesYearsOptions,
    getMoviesRuntimeOptions,
    getMoviesRevenueOptions,
    getMoviesRatingsOptions
};

export {
    TRANSFORMS,
    FILTERS,
    SORTS,
    GET_OPTIONS
};
