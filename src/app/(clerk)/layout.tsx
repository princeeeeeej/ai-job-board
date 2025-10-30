import { ReactNode } from "react";

export default function Clerklayout({children}: {children : ReactNode}){
    return (
        <div className="flex h-screen w-screen items-center justify-center">
            <div>{children}</div>
        </div>
    )
}