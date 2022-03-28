import React from "react";

import {
    createStore, createMap, createOrderedMap,
    storeUpdater,

} from "@ui-schema/ui-schema";

import {
    TextField,
} from '@material-ui/core'

import { Modal, Box, Grid, Paper, styled } from '@mui/material';

import MenuBookIcon from '@mui/icons-material/MenuBook';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import EditIcon from '@mui/icons-material/Edit';

import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

import { UIStoreProvider } from '@ui-schema/ui-schema/UIStore';
import { UIMetaProvider } from '@ui-schema/ui-schema/UIMeta';
import { UIRootRenderer } from '@ui-schema/ui-schema/UIRootRenderer';
import { makeTranslator } from "@ui-schema/ui-schema/Translate/makeTranslator";
import { widgets } from "@ui-schema/ds-material";
import { en } from '@ui-schema/dictionary'
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import networksSchema from './network.schema';

const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

const dicEN = createMap({
    error: en.errors,
    labels: { ...en.labels, ...en.richText },
    widget: {}, // overwrite single widget translations
    titles: {}, // overwrite specific titles all the time (no matter in which widget)
});

const editModalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '50%',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};


const tEN = makeTranslator(dicEN, 'en');

// const networksSchema = require("./resolved.schema.json")
const combineSchema = {
    "type": "object",
    "properties": {
        "networks": networksSchema()
        // "networks": networksSchema
    }
};

const values = { networks: [] };

const Generator = () => {
    // eslint-disable-next-line 
    const [showValidity, setShowValidity] = React.useState(true);

    const [store, setStore] = React.useState(() => createStore(createOrderedMap(values)));

    // eslint-disable-next-line 
    const [schema, setSchema] = React.useState(() => createOrderedMap(combineSchema));

    // START JSON_VIEW
    // Used to render modal overlay that displays JSON Snippet
    const [modalOpen, setModalOpen] = React.useState(false);
    const handleModalOpen = () => setModalOpen(true);
    const handleModalClose = () => setModalOpen(false);
    // STOP JSON_VIEW

    // START COPY_JSON
    const [copyIcon, setCopyIcon] = React.useState(false);
    const handleCopyIconClick = () => setCopyIcon(true);
    const handleCopyIconClose = () => setCopyIcon(false);

    let copyIconText
    if (!copyIcon) {
        copyIconText = "Copy Generated JSON"
    } else {
        copyIconText = "Generated JSON Copied!!"
    }

    const generatedJSON = JSON.stringify(store.valuesToJS().networks, undefined, 2)
    // STOP COPY_JSON

    const onChange = React.useCallback((storeKeys, scopes, updater, deleteOnEmpty, type) => {
        setStore(storeUpdater(storeKeys, scopes, updater, deleteOnEmpty, type))
    }, [setStore])

    const [type, setType] = React.useState(false);
    const handleTypeChange = (e) => {
        setType(e.target.value);
        const getSchema =  networksSchema(e.target.value === 'basic');
        setSchema(
            createOrderedMap({
                "type": "object",
                "properties": {
                    "networks": getSchema
                }
            })
        );
    }


    return (
        <React.Fragment>
            <Grid container>
                <Grid item xs={12}>
                    <Item>
                        <Tooltip title="View Generated JSON">
                            <IconButton>
                                <EditIcon
                                    onClick={handleModalOpen}
                                />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title={copyIconText}
                            onClose={handleCopyIconClose}
                            onClick={handleCopyIconClick}
                        >
                            <IconButton>
                                <ContentCopyIcon
                                    onClick={() => {
                                        // navigator.clipboard.writeText(JSON.stringify(store.valuesToJS().networks, undefined, 2));
                                        navigator.clipboard.writeText(generatedJSON);
                                    }}
                                />
                            </IconButton>
                        </Tooltip>
                        <Modal
                            open={modalOpen}
                            onClose={handleModalClose}
                            aria-labelledby="modal-modal-title"
                            aria-describedby="modal-modal-description"
                        >
                            <Box sx={editModalStyle}>
                                <TextField
                                    id="generated_json"
                                    variant="filled"
                                    value={generatedJSON}
                                    multiline
                                    fullWidth
                                    minRows={10}
                                    maxRows={25}
                                    disabled
                                />
                            </Box>
                        </Modal>
                        <Tooltip title="Network Foundation Documentation">
                            <IconButton>
                                <MenuBookIcon
                                    onClick={() => window.open(document.location.pathname + "/documentation", "_blank")}
                                />
                            </IconButton>
                        </Tooltip>
                    </Item>
                </Grid>
                <Grid item xs={12}>
                    <Item>
                        <FormControl>
                            <FormLabel id="template_type">Template Type</FormLabel>
                            <RadioGroup
                                row
                                aria-labelledby="template_type"
                                name="template_type"
                                value={type}
                                onChange={(e) => handleTypeChange(e)}
                            >
                                <FormControlLabel value="basic" control={<Radio />} label="Basic" />
                                <FormControlLabel value="advance" control={<Radio />} label="Advanced" />
                            </RadioGroup>
                        </FormControl>
                    </Item>
                    <Item>
                        <UIStoreProvider
                            store={store}
                            onChange={onChange}
                            showValidity={showValidity}
                        >
                            <UIRootRenderer schema={schema} />
                        </UIStoreProvider>
                    </Item>
                </Grid>
            </Grid>
        </React.Fragment>
    )
};


const Foundations = () => {
    return <UIMetaProvider widgets={widgets} t={tEN}>
        <Generator />
    </UIMetaProvider>
}


export default Foundations