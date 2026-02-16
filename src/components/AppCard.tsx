import { useState } from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Tooltip,
} from "@heroui/react";
import { ArrowDownToBracket, InfoCircle, Star as StarOutline, TrashBin, CheckCircle, CloseCircle } from "flowbite-react-icons/outline";
import { Star as StarSolid } from "flowbite-react-icons/solid";
import AppIcon from "./AppIcon";
import { useToast } from "./ToastContext";

type AppCardProps = {
  id: string;
  name: string;
  description?: string;
  details?: string;
  color?: string;
  isFavorite: boolean;
  isInstalled: boolean;
  onToggleFavorite: (id: string) => void;
  onToggleInstall: (id: string) => void;
  onOpen?: () => void;
  pages?: { id: string; label: string; path: string }[];
};

export default function AppCard({
  id,
  name,
  description,
  details,
  color,
  isFavorite,
  isInstalled,
  onToggleFavorite,
  onToggleInstall,
  onOpen,
  pages = [],
}: AppCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  function handleToggleFavorite() {
    onToggleFavorite(id);
    showToast({
      message: isFavorite ? `Removed from favorites` : `Added to favorites`,
      type: isFavorite ? "danger" : "success",
      icon: isFavorite ? <CloseCircle className="text-red-500 mr-2" size={18} /> : <StarSolid className="text-yellow-400 mr-2" size={18} />,
    });
  }

  async function handleToggleInstall() {
    setLoading(true);
    await onToggleInstall(id);
    setLoading(false);
    showToast({
      message: isInstalled ? `Uninstalled ${name}` : `Installed ${name}`,
      type: isInstalled ? "danger" : "success",
      icon: isInstalled ? <CloseCircle className="text-red-500 mr-2" size={18} /> : <CheckCircle className="text-green-500 mr-2" size={18} />,
    });
  }

  return (
    <div className="app-card">
      <div className="app-card-inner">
        <button
          type="button"
          className="app-card-avatar app-icon"
          onClick={onOpen}
          aria-label={`Open ${name}`}
        >
          <AppIcon appId={id} color={color} size={22} />
        </button>
        <div className="app-card-text">
          <div className="app-card-name">{name}</div>
          {description ? <div className="app-card-description">{description}</div> : null}
          <div className="app-card-actions">
            {isInstalled ? (
              <Tooltip
                placement="bottom"
                content={
                  <span className="app-tooltip">{isFavorite ? "Unfavorite" : "Favorite"}</span>
                }
              >
                <Button
                  isIconOnly
                  variant="flat"
                  onPress={handleToggleFavorite}
                  onClick={(event) => event.stopPropagation()}
                  aria-label={`${isFavorite ? "Unfavorite" : "Favorite"} ${name}`}
                >
                  {isFavorite ? (
                    <StarSolid size={16} color="#f6c94d" />
                  ) : (
                    <StarOutline size={16} />
                  )}
                </Button>
              </Tooltip>
            ) : null}
            <Tooltip
              placement="bottom"
              content={<span className="app-tooltip">Details</span>}
            >
              <Button
                isIconOnly
                variant="flat"
                onPress={() => setIsOpen(true)}
                onClick={(event) => event.stopPropagation()}
                aria-label={`Read more about ${name}`}
              >
                <InfoCircle size={16} />
              </Button>
            </Tooltip>
            <Tooltip
              placement="bottom"
              content={
                <span className="app-tooltip">{isInstalled ? "Uninstall" : "Install"}</span>
              }
            >
              <Button
                isIconOnly
                variant={isInstalled ? "flat" : "solid"}
                color={isInstalled ? "default" : "primary"}
                onClick={async (event) => { event.stopPropagation(); await handleToggleInstall(); }}
                disabled={loading}
                aria-label={isInstalled ? `Uninstall ${name}` : `Install ${name}`}
              >
                {isInstalled ? <TrashBin size={16} /> : <ArrowDownToBracket size={16} />}
              </Button>
            </Tooltip>
          </div>
        </div>
      </div>

      <Modal isOpen={isOpen} onOpenChange={setIsOpen} size="lg">
        <ModalContent>
          <ModalHeader>
            <div className="app-modal-header">
              <span className="app-modal-icon" aria-hidden="true">
                <AppIcon appId={id} color={color} size={24} />
              </span>
              <div>
                <div className="app-modal-title">{name}</div>
                <div className="app-modal-subtitle">{details || description || "App details"}</div>
              </div>
            </div>
          </ModalHeader>
          <ModalBody>
            <div className="app-modal-section">
              <div className="app-modal-label">Pages</div>
              <ul className="app-modal-list">
                {pages.map((page) => (
                  <li key={page.id}>{page.label}</li>
                ))}
              </ul>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="flat" onPress={() => setIsOpen(false)}>
              Close
            </Button>
            <Button
              color={isInstalled ? "default" : "primary"}
              variant={isInstalled ? "flat" : "solid"}
              onPress={() => onToggleInstall(id)}
            >
              {isInstalled ? "Uninstall" : "Install"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
