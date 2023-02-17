import "./Error.css";

export const Error = (props: { msg: string }) => {
    return (
        <dialog id="error" open>
            <section id="panel">
                <div>{ props.msg }</div>
            </section>
        </dialog>
    )
}
