import { useEffect, useMemo, useState } from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Tooltip,
} from "@heroui/react";
import { ArrowDownToBracket, InfoCircle, Star as StarOutline, TrashBin } from "flowbite-react-icons/outline";
import { Star as StarSolid } from "flowbite-react-icons/solid";
import AppIcon from "./AppIcon";
import { readTags, writeTags } from "../lib/appStorage";

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
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");

  useEffect(() => {
    const store = readTags();
    setTags(store[id] ?? []);
  }, [id]);

  const normalizedTags = useMemo(
    () => tags.map((tag) => tag.trim()).filter(Boolean),
    [tags]
  );

  function persistTags(next: string[]) {
    const store = readTags();
    store[id] = next;
    writeTags(store);
    setTags(next);
  }

  function addTag() {
    const value = newTag.trim();
    if (!value) return;
    if (normalizedTags.includes(value)) return;
    persistTags([...normalizedTags, value]);
    setNewTag("");
  }

  function removeTag(tag: string) {
    persistTags(normalizedTags.filter((t) => t !== tag));
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
                  onPress={onToggleFavorite.bind(null, id)}
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
                onPress={onToggleInstall.bind(null, id)}
                onClick={(event) => event.stopPropagation()}
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
            <div className="app-modal-section">
              <div className="app-modal-label">Tags</div>
              <div className="app-tags">
                {normalizedTags.length === 0 ? (
                  <span className="app-tags-empty">No tags yet</span>
                ) : (
                  normalizedTags.map((tag) => (
                    <button key={tag} type="button" className="app-tag" onClick={() => removeTag(tag)}>
                      {tag}
                      <span className="app-tag-remove">×</span>
                    </button>
                  ))
                )}
              </div>
              <div className="app-tags-input">
                <input
                  className="app-tags-field"
                  type="text"
                  placeholder="Add tag"
                  value={newTag}
                  onChange={(event) => setNewTag(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      addTag();
                    }
                  }}
                />
                <Button size="sm" variant="flat" onPress={addTag}>
                  Add
                </Button>
              </div>
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
