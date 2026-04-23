import AppLogoIcon from './app-logo-icon';

export default function AppLogo() {
    return (
        <>
            <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-12 items-center justify-center rounded-md">
                <AppLogoIcon className="size-7 fill-current text-white dark:text-black" />
            </div>
            <div className="ml-2 grid flex-1 text-left text-lg">
                <span className="mb-0.5 truncate leading-none font-bold">FutsalHub</span>
            </div>
        </>
    );
}
