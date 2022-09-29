import classes from '../styles/MoviesComments.module.scss';
import { Movie } from './MoviesTable';
import { FiArrowLeft } from 'react-icons/fi';
import { FaPaperPlane } from 'react-icons/fa';
import { getComments, updateComments } from '../data/CommentsService';
import { useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

function MoviesComments(props: { movie: Movie, closeFn: Function}) {
    const { movie, closeFn } = props;
    const [ isLoading, setIsLoading ] = useState(false);
    const [ commentInput, setCommentInput ] = useState('');
    const [ comments, setComments ] = useState([] as Array<string>);

    useEffect(() => {

        (async () => {
            setIsLoading(true);

            const docId = movieTitleToDocId(movie.title);
            setComments(await getComments(docId));

            setIsLoading(false);
        })();

    }, []);


    async function handleClick(movieTitle: string) {
        setIsLoading(true);

        setCommentInput('');

        const docId = movieTitleToDocId(movieTitle);
        const oldComments = comments;
        const newComment = commentInput;
        const updatedComments = await addComment(docId, oldComments, newComment);
        setComments(updatedComments);

        setIsLoading(false);
    }

    return <div className={classes.moviesComments}>
        <header>
            <button onClick={() => closeFn()}>
                <FiArrowLeft/>
            </button>

            <h1> {movie.title} Comments</h1>
        </header>

        <ul>
            {
                isLoading
                    ? <Skeleton count={ 5 } className={classes.skeleton}/>
                    : comments.map(comment => <li>{ comment }</li>)
            }
        </ul>

        <footer>
            <input type="text" onChange={ (e) => setCommentInput(e.target.value) } value={commentInput} />
            <button onClick={() => handleClick(movie.title)}>
                <FaPaperPlane/>
            </button>
        </footer>
    </div>;
}

export { MoviesComments }

function movieTitleToDocId(movieTitle: string): string {
    return movieTitle.replace(/ /g, '-').toLowerCase();
}

async function addComment(docId: string, oldComments: Array<string>, newComment: string): Promise<Array<string>> {
    const updatedComments = [...oldComments, newComment];

    await updateComments(docId, updatedComments);

    return updatedComments;
}