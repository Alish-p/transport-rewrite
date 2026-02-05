import Container from '@mui/material/Container';

import { useSettingsContext } from 'src/components/settings';

export default function TyreEditView() {
    const settings = useSettingsContext();
    return (
        <Container maxWidth={settings.themeStretch ? false : 'lg'}>
            <div>Tyre Edit View (Under Construction)</div>
        </Container>
    );
}
