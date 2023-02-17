import "./Loading.css";

export const Loading = (props: { msg: string }) => {
    return (
        <dialog id="loading" open>
            <section id="panel">
                <div>{ props.msg }</div>
                <div id="ripple"><div /><div /></div>
            </section>
        </dialog>
    )
}
