import icon from "../assets/icon.png";
import arrowDown from "../assets/arrowDown.svg";
import plus from "../assets/plus.svg"

function Chat() {

    return (
        <div className="bg-white flex h-screen">
            <div className="w-1/4 border flex flex-col">
                <div className=" flex gap-2 pr-4  p-5 border-b items-center">
                    <img src={icon} alt="Logo" className="h-12 w-12"/>
                    <h1 className="text-4xl font-bold text-primary">Chatademia</h1>
                </div>
                <div className=" flex gap-2 justify-between items-center p-5">
                    <div className="flex gap-2 items-center">
                        <h1 className="font-semibold text-black text-xl">Czaty grupowe</h1>
                        <img src={arrowDown} alt="arrow down" className="h-5 w-5"/>
                    </div> 
                    <div className="rounded-full bg-primary text-white overflow-visible h-8 w-8 flex justify-center items-center cursor-pointer">
                        <img src={plus} alt="plus" className="h-6 w-6"/>
                    </div>

                </div>

            </div>
            <div className="w-1/2 border p-4">

            </div>
            <div className="w-1/4 border p-4">

            </div>
        </div>
    )
}

export default Chat;