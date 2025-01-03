import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
Dialog,
DialogContent,
DialogDescription,
DialogFooter, 
DialogHeader,
DialogTitle
} from "@/components/ui/dialog"

export const useConfirm = (title: string, message: string): [() => JSX.Element, () => Promise<unknown>] => {
    const [promise, setPromise] = useState<{resolve: (value: boolean) => void} | null>(null);
    const confirm = () => new Promise((resolve, reject) => {
        setPromise({resolve});
    });
    const handleClose = () => {
        setPromise(null);
    };
    const handleConfirm = () => {
        promise?.resolve(true);
        handleClose();
    };
    const handleCancle = () => {
        promise?.resolve(false);
        handleClose();
    };
    const ConfirmationDialog = () => {
        return <Dialog open={promise !== null} onOpenChange={
            (open) => {
                if(!open){
                    handleClose();
                }
            }
        
        }>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{message}</DialogDescription>
                </DialogHeader>
                <DialogFooter className="pt-2">
                    <Button onClick={handleCancle} variant="outline">Cancle</Button>
                    <Button onClick={handleConfirm}>Confirm</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    }
    return [ConfirmationDialog, confirm];
}