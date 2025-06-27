import React, { useState, useContext } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useTranslation } from 'react-i18next';
import { ThemeContext } from '../../ThemeContext'; // تأكد من المسار الصحيح

// إعداد أيقونة Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function LocationMarker({ selectedPosition, setSelectedPosition }) {
  useMapEvents({
    click(e) {
      setSelectedPosition(e.latlng);
    },
  });

  return selectedPosition ? <Marker position={selectedPosition} /> : null;
}

function MapModal({ isOpen, onClose, onConfirmLocation }) {
  const [selectedPosition, setSelectedPosition] = useState(null);
  const latLatakia = [35.537, 35.776];
  const zoomLevel = 12;
  const { t } = useTranslation();
  const { darkMode } = useContext(ThemeContext);

  const handleConfirm = () => {
    if (selectedPosition) {
      onConfirmLocation(selectedPosition);
    } else {
      alert(t('map.select_location_alert'));
    }
  };

  const handleCancel = () => {
    setSelectedPosition(null);
    onClose();
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert(t('map.geolocation_not_supported'));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setSelectedPosition({ lat: latitude, lng: longitude });
      },
      () => alert(t('map.geolocation_error')),
      { enableHighAccuracy: true }
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 p-4">
      <div
        className={`rounded-xl shadow-xl w-full max-w-3xl p-6 space-y-6 relative ${
          darkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'
        }`}
      >
        {/* زر الإغلاق */}
        <button
          onClick={handleCancel}
          className={`absolute top-4 left-4 text-2xl font-bold ${
            darkMode ? 'text-white hover:text-red-400' : 'text-gray-500 hover:text-red-600'
          }`}
          aria-label={t('map.close')}
        >
          ×
        </button>

        <h3 className="text-2xl font-bold text-center text-purple-500">
          {t('map.title')}
        </h3>

        <MapContainer
          center={latLatakia}
          zoom={zoomLevel}
          style={{ height: '400px', width: '100%' }}
          whenCreated={(map) => {
            const bounds = [
              [35.38, 35.60],
              [35.65, 35.95],
            ];
            map.setMaxBounds(bounds);
            map.on('drag', () => {
              if (!map.getBounds().contains(map.getCenter())) {
                map.panInsideBounds(bounds, { animate: true });
              }
            });
          }}
        >
          <TileLayer
            attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker
            selectedPosition={selectedPosition}
            setSelectedPosition={setSelectedPosition}
          />
        </MapContainer>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <button
            onClick={handleUseCurrentLocation}
            className="bg-yellow-400 text-purple-900 px-5 py-3 rounded-lg font-semibold hover:bg-yellow-300 transition shadow"
          >
            📍 {t('map.use_current_location')}
          </button>

          <button
            onClick={handleConfirm}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg shadow transition font-semibold"
          >
            ✅ {t('map.confirm')}
          </button>
        </div>
      </div>
    </div>
  );
}

export default MapModal;
