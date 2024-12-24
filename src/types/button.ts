export interface ButtonProps {
    label?: string;
    title?: string;
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    disabled?: boolean;
    type: 'submit' | 'button';
    className: string;
    children?: React.ReactNode; 
    showLabel?: boolean;
}
