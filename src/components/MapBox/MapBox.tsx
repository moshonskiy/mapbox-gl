import React, { FunctionComponent, useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom/client';

import mapboxgl from 'mapbox-gl';

import { Button } from '@mui/material';
import Alert from '@mui/material/Alert';

import LinearScaleIcon from '@mui/icons-material/LinearScale';
import RoomIcon from '@mui/icons-material/Room';

import Popup from '../Popup';

import s from './Mapbox.module.css';

const MapBox: FunctionComponent = () => {
    const [map, setMap] = useState<mapboxgl.Map | null>(null);
    const mapNode = useRef<HTMLDivElement>(null);

    const [lng, setLng] = useState(37.62);
    const [lat, setLat] = useState(55.74);
    const [zoom, setZoom] = useState(9);

    const [addPoint, setAddPoint] = useState(false);
    const [addLineAlert, setAddLineAlert] = useState(false);

    const [markers, setMarkers] = useState<mapboxgl.Marker[]>([]);
    const [areMarkersHidden, setAreMarkersHidden] = useState(false);

    useEffect(() => {
        const node = mapNode.current;

        if (typeof window === 'undefined' || node === null) {
            return;
        }

        const mapboxMap = new mapboxgl.Map({
            container: node,
            accessToken: 'pk.eyJ1IjoiYmF0a2Ftb3Nobm8iLCJhIjoiY2tncXgyNWtkMHB6YTJzbDhpb2NnaG9lMSJ9.Si0BkgsQqhfjr7EBLDkuWA',
            style: 'mapbox://styles/mapbox/streets-v12',
            center: [lng, lat],
            zoom: zoom,
        });

        setMap(mapboxMap);

        return () => {
            mapboxMap.remove();
            setMap(null);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (!mapNode.current || !map) {
            return;
        }

        const addMarker = (e: mapboxgl.MapMouseEvent & mapboxgl.EventData) => {
            if (addPoint) {

                const newMarkerPosition: [number, number] = [e.lngLat.lng, e.lngLat.lat];

                const node = document.createElement('div');
                const root = ReactDOM.createRoot(node);

                const popup = new mapboxgl.Popup()
                    .setDOMContent(node);

                const marker = new mapboxgl.Marker()
                    .setLngLat(newMarkerPosition)
                    .setPopup(popup)
                    .addTo(map);

                setMarkers((prev) => [...prev, marker]);

                root.render(
                    <Popup
                        creationDate={new Date().toLocaleDateString()}
                    />)

                setAddPoint(false);
                map.getCanvas().style.cursor = 'grab';
            }
        }

        map.on('move', () => {
            setLng(Number(map.getCenter().lng.toFixed(4)));
            setLat(Number(map.getCenter().lat.toFixed(4)));
            setZoom(Number(map.getZoom().toFixed(2)));
        });

        map.on('click', addMarker);

        return () => {
            map.off('click', addMarker);
        }
    }, [addPoint, map, markers]);

    const handleAddPoint = () => {
        setAddPoint(true);
        if (mapNode.current && map) {
            map.getCanvas().style.cursor = 'crosshair';
        }
    };

    const handleDeleteAllMarkers = () => {
        for (const marker of markers) {
            marker.remove();
        }

        setMarkers([]);
    }

    const handleHideAllMarkers = () => {
        for (const marker of markers) {
            marker.getElement().style.display = 'none';
        }

        setAreMarkersHidden(true);
    };

    const handleShowAllMarkers = () => {
        for (const marker of markers) {
            marker.getElement().style.display = 'block';
        }

        setAreMarkersHidden(false);
    }

    const handleAlert = () => {
        setAddLineAlert(true);

        setTimeout(() => {
            setAddLineAlert(false);
        }, 3000);
    };

    const noMarkers = markers.length === 0;
    const hideButton = markers.length > 0 && areMarkersHidden;
    const showButton = markers.length > 0 && !areMarkersHidden

    return (
        <div>
            <div className={s.sidebar}>
                <div className={s.actions}>
                    <Button
                        variant="contained"
                        onClick={handleAddPoint}
                    >
                        <RoomIcon />
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleAlert}
                    >
                        <LinearScaleIcon />
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        disabled={noMarkers}
                        onClick={handleDeleteAllMarkers}
                    >
                        delete all markers
                    </Button>
                    <Button
                        variant="contained"
                        disabled={noMarkers || hideButton}
                        onClick={handleHideAllMarkers}
                    >
                        hide all markers
                    </Button>
                    <Button
                        variant="contained"
                        disabled={noMarkers || showButton}
                        onClick={handleShowAllMarkers}
                    >
                        show all markers
                    </Button>
                </div>
            </div>

            <div
                ref={mapNode}
                className={s.mapContainer}
            />
            {addLineAlert && (
                <Alert
                    severity="warning"
                    className={s.alert}
                >
                    This feature is not implemented
                </Alert>
            )}
        </div>
    )
};

export default MapBox;
