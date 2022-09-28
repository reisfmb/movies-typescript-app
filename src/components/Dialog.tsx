import classes from './Dialog.module.scss';

interface DialogProps {
    show: boolean
    children: JSX.Element
}

function Dialog(props: DialogProps) {
    if(!props.show) return <></>;

    return <div className={classes.dialog}>{props.children}</div>;
}

export { Dialog }