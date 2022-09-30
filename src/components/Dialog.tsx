import classes from '../styles/Dialog.module.scss';

interface DialogProps {
    show: boolean
    children: JSX.Element
}

function Dialog(props: DialogProps) {
    if(!props.show) return <></>;

    return <>
        <div className={classes.overlay}></div>
        <div className={classes.dialog}>{props.children}</div>
    </>;
}

export { Dialog };