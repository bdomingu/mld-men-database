import ReactLoading from 'react-loading';

export default function Loading () {
 const divStyle = {
    height: '500px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
};

    return (
        <div style={divStyle}>
            <ReactLoading type="spin" color="#146DA6" height={150} width={50}/>
        </div>
    )
}