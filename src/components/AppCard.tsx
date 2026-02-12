import React, { useEffect, useMemo, useState } from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import { ArrowDownToBracket, InfoCircle, Star, TrashBin } from "flowbite-react-icons/outline";
import AppIcon from "./AppIcon";

const APP_TAGS_KEY = "appTags:v1";

type TagStore = Record<string, string[]>;

function readTags(): TagStore {
  try {
    const raw = localStorage.getItem(APP_TAGS_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as TagStore;
  } catch {
    return {};
  }
}

function writeTags(store: TagStore) {
  localStorage.setItem(APP_TAGS_KEY, JSON.stringify(store));
}

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
      <div className="app-card-inner" onClick={onOpen}>
        <span className="app-card-avatar app-icon" aria-hidden="true">
          <AppIcon appId={id} color={color} size={22} />
        </span>
        <div className="app-card-text">
          <div className="app-card-name">{name}</div>
          {description ? <div className="app-card-description">{description}</div> : null}
          <div className="app-card-actions">
            {isInstalled ? (
              <Button
                isIconOnly
                variant="flat"
                onPress={(event) => {
                  event?.stopPropagation?.();
                  onToggleFavorite(id);
                }}
                onClick={(event) => event.stopPropagation()}
                aria-label={`${isFavorite ? "Unfavorite" : "Favorite"} ${name}`}
              >
                <Star size={16} color={isFavorite ? "#f6c94d" : undefined} />
              </Button>
            ) : null}
            <Button
              isIconOnly
              variant="flat"
              onPress={(event) => {
                event?.stopPropagation?.();
                setIsOpen(true);
              }}
              onClick={(event) => event.stopPropagation()}
              aria-label={`Read more about ${name}`}
            >
              <InfoCircle size={16} />
            </Button>
            <Button
              isIconOnly
              variant={isInstalled ? "flat" : "solid"}
              color={isInstalled ? "default" : "primary"}
              onPress={(event) => {
                event?.stopPropagation?.();
                onToggleInstall(id);
              }}
              onClick={(event) => event.stopPropagation()}
              aria-label={isInstalled ? `Uninstall ${name}` : `Install ${name}`}
            >
              {isInstalled ? <TrashBin size={16} /> : <ArrowDownToBracket size={16} />}
            </Button>
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
