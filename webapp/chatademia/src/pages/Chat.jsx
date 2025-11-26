

function Chat() {

    return (
        <div className="bg-white flex h-screen">
            <div className="w-1/4 border p-4 flex-col">
                <div className="border flex gap-2 pr-4">
                    <img src="../assets/icon.png" alt="Logo" className="h-8 w-8"/>
                    <h1 className="text-2xl font-bold text-primary">Chatademia</h1>
                </div>
                <div className="border flex gap-2 pt-2 justify-between items-center">
                    <div className="flex gap-1 items-center">
                        <h1 className="font-semibold text-black text-xl">Czaty grupowe</h1>
                        <img src="../assets/arrowDown.svg" alt="arrow down" className="h-4 w-4"/>
                    </div> 
                    <div className="rounded-full bg-primary text-white">
                        <h1>+</h1>
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