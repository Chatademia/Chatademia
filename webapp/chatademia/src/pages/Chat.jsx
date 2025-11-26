import icon from "../assets/icon.png";
import arrowDown from "../assets/arrowDown.svg";
import plus from "../assets/plus.svg"
import Lectures from "../components/Lectures.jsx";
import dots  from "../assets/dotsPrimary.svg";
import Users from "../components/Users.jsx";

function Chat() {

    return (
        <div className="bg-white flex h-screen">
            <div className="w-1/4 border flex flex-col">
                <div className=" flex gap-2 pr-4 px-5 h-[7.74%] border-b items-center">
                    <img src={icon} alt="Logo" className="h-12 w-12"/>
                    <h1 className="text-4xl font-bold text-primary">Chatademia</h1>
                </div>
                <div className=" flex gap-2 h-[8.63%] justify-between border-b items-center p-5">
                    <div className="flex gap-2 items-center">
                        <h1 className="font-semibold text-black text-xl">Czaty grupowe</h1>
                        <img src={arrowDown} alt="arrow down" className="h-5 w-5"/>
                    </div> 
                    <div className="rounded-full bg-primary text-white overflow-visible h-8 w-8 flex justify-center items-center cursor-pointer">
                        <img src={plus} alt="plus" className="h-6 w-6"/>
                    </div>
                </div>
                <div className="flex flex-col gap-4 p-5 border-b h-[76.77%] overflow-y-auto">
                    <Lectures isActive={false} color="red" lectureAcronym="IO" lectureName="Inżynieria Oprogramowania (gr. 24)"/>
                    <Lectures isActive={true} color="blue" lectureAcronym="SI" lectureName="Sztuczna Inteligencja (gr. 11)"/>
                    <Lectures isActive={false} color="green" lectureAcronym="AM" lectureName="Analiza Matematyczna 1 (gr. 10)"/>
                    <Lectures isActive={false} color="yellow" lectureAcronym="PP" lectureName="Podstawy programowania (gr. 14)"/>
                    <Lectures isActive={false} color="green" lectureAcronym="ZR" lectureName="Zbiory Rozmyte (gr. 12)"/>
                </div>
                <div className="h-[6.94%] flex p-5 gap-3 justify-left items-center ">
                    <div className={`rounded-xl bg-orange-500 text-white  flex items-center justify-center w-10 h-10`}>
                        <h1 className="text-xl font-black">RM</h1>
                    </div>
                    <h1 className="font-semibold text-sm text-black">Robert Michalak</h1>
                </div>

            </div>
            <div className="w-1/2 border">
                
            </div>
            <div className="w-1/4 border">
                <div className=" flex gap-2 pr-4 h-[7.74%] justify-between p-5 border-b items-center">
                    <h1 className="font-semibold text-black text-xl">Grupa</h1>
                    <div className="rounded-full h-8 w-8 bg-violet-50 items-center justify-center flex">
                        <img src={dots} alt="dots" className="h-5 w-5"/>
                    </div>
                </div>
                <div className="flex flex-col gap-4 p-5 h-[92.26%] overflow-y-auto"> 
                    <div className="flex gap-2 items-center">
                        <h1 className="font-medium text-black text-lg">Uczestnicy</h1>
                        <span className="bg-purple-50 text-primary text-xs font-bold px-2 py-1 rounded-full">4</span>
                    </div>
                    <Users color="red" userName="Anna Kowalska" userAcronym="AK" userStatus={true}/>
                    <Users color="blue" userName="Jan Nowak" userAcronym="JN" userStatus={false}/>
                    <Users color="green" userName="Maria Wiśniewska" userAcronym="MW" userStatus={false}/>
                    <Users color="yellow" userName="Piotr Zieliński" userAcronym="PZ" userStatus={false}/>
                    <div className="w-full mt-2">
                        <hr className="border-t-1 border-gray-300" />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Chat;