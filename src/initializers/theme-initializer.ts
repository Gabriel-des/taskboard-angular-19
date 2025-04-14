import { APP_INITIALIZER, EnvironmentProviders, inject, Provider } from "@angular/core";
import { ThemeService } from "../app/shared/services/theme.service";

function initializeTheme(): () => void {
    return () => {
        const themeService = inject(ThemeService);

        const currentColorTheme = themeService.getPreferredColorTheme();

		themeService.setColorTheme(currentColorTheme);
    }
}

export const configThemeInitializerProvider: Provider | EnvironmentProviders = {
    provide: APP_INITIALIZER,
    useFactory: initializeTheme,
    deps: [ThemeService],
    multi: true
}