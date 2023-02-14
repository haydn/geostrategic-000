import "./Game.css";

import { SupabaseClient, User } from "@supabase/supabase-js";
import { ParentSize } from "@visx/responsive";
import differenceInMilliseconds from "date-fns/differenceInMilliseconds";
import parseISO from "date-fns/parseISO";
import { useEffect, useState } from "react";
import IconEditor from "./IconEditor";
import Token from "./Token";
import parsePosition from "./utils/parsePosition";
import { Database } from "./_types";

type Point = { x: number; y: number };
export type Box = [Point, Point];

type Classification = Database["public"]["Tables"]["classifications"]["Row"];
type Unit = Database["public"]["Tables"]["units"]["Row"] & { position: Box };
type Player = Database["public"]["Tables"]["players"]["Row"];

const DIRECTIONS = {
  ArrowDown: "south",
  ArrowLeft: "west",
  ArrowRight: "east",
  ArrowUp: "north",
} as const;

const MAX_ZOOM = 20;
const MIN_ZOOM = 1;

const isDirectionKey = (key: string): key is keyof typeof DIRECTIONS =>
  key in DIRECTIONS;

const Game = ({
  supabaseClient,
  user,
}: {
  supabaseClient: SupabaseClient<Database>;
  user: User;
}) => {
  const [now, setNow] = useState(new Date());
  const [units, setUnits] = useState<Array<Unit>>([]);
  const [classifications, setClassifications] = useState<Array<Classification>>(
    []
  );
  const [players, setPlayers] = useState<Array<Player>>([]);
  const [selectedUnitId, setSelectedUnitId] = useState<string | undefined>(
    undefined
  );
  const [showIconEditor, setShowIconEditor] = useState(false);
  const [showGrid, setShowGrid] = useState(false);

  const [camera, setCamera] = useState({ x: 0, y: 0, zoom: 10 });

  const player = players.find((player) => player.user_id === user.id);

  const selectedUnit = selectedUnitId
    ? units.find((unit) => unit.id === selectedUnitId)
    : undefined;

  const selectedClassification = selectedUnit
    ? classifications.find(
        (classification) => classification.id === selectedUnit.classification_id
      )
    : undefined;

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 200);
    return () => {
      clearInterval(interval);
    };
  });

  useEffect(() => {
    supabaseClient
      .from("players")
      .select("*")
      .then(({ data }) => {
        if (data) setPlayers(data);
      });
    supabaseClient
      .from("classifications")
      .select("*")
      .then(({ data }) => {
        if (data) setClassifications(data);
      });
    supabaseClient
      .from("units")
      .select("*")
      .then(({ data }) => {
        if (data) {
          setUnits(
            data.map((unit) => ({
              ...unit,
              position: parsePosition(unit.position as string),
            }))
          );
        }
      });
  }, [supabaseClient]);

  useEffect(() => {
    const playerDeleteChannel = supabaseClient.channel("players-delete");
    const playerInsertChannel = supabaseClient.channel("players-insert");
    const playerUpdateChannel = supabaseClient.channel("players-update");
    const classificationsDeleteChannel = supabaseClient.channel(
      "classifications-delete"
    );
    const classificationInsertChannel = supabaseClient.channel(
      "classifications-insert"
    );
    const classificationUpdateChannel = supabaseClient.channel(
      "classifications-update"
    );
    const unitDeleteChannel = supabaseClient.channel("units-delete");
    const unitInsertChannel = supabaseClient.channel("units-insert");
    const unitUpdateChannel = supabaseClient.channel("units-update");

    playerDeleteChannel
      .on<Player>(
        "postgres_changes",
        {
          event: "DELETE",
          table: "players",
          schema: "public",
        },
        (payload) => {
          setPlayers((current) =>
            current.filter((player) => player.id !== payload.old.id)
          );
          setNow(new Date());
        }
      )
      .subscribe((status) => {
        console.log(playerDeleteChannel.topic, status);
      });

    playerInsertChannel
      .on<Player>(
        "postgres_changes",
        {
          event: "INSERT",
          table: "players",
          schema: "public",
        },
        (payload) => {
          setPlayers((current) => current.concat(payload.new));
          setNow(new Date());
        }
      )
      .subscribe((status) => {
        console.log(playerInsertChannel.topic, status);
      });

    playerUpdateChannel
      .on<Player>(
        "postgres_changes",
        {
          event: "UPDATE",
          table: "players",
          schema: "public",
        },
        (payload) => {
          setPlayers((current) =>
            current.map((player) =>
              player.id === payload.new.id ? payload.new : player
            )
          );
          setNow(new Date());
        }
      )
      .subscribe((status) => {
        console.log(playerUpdateChannel.topic, status);
      });

    classificationsDeleteChannel
      .on<Classification>(
        "postgres_changes",
        {
          event: "DELETE",
          table: "classifications",
          schema: "public",
        },
        (payload) => {
          setClassifications((current) =>
            current.filter(
              (classification) => classification.id !== payload.old.id
            )
          );
          setNow(new Date());
        }
      )
      .subscribe((status) => {
        console.log(classificationsDeleteChannel.topic, status);
      });

    classificationInsertChannel
      .on<Classification>(
        "postgres_changes",
        {
          event: "INSERT",
          table: "classifications",
          schema: "public",
        },
        (payload) => {
          setClassifications((current) => current.concat(payload.new));
          setNow(new Date());
        }
      )
      .subscribe((status) => {
        console.log(classificationInsertChannel.topic, status);
      });

    classificationUpdateChannel
      .on<Classification>(
        "postgres_changes",
        {
          event: "UPDATE",
          table: "classifications",
          schema: "public",
        },
        (payload) => {
          setClassifications((current) =>
            current.map((classification) =>
              classification.id === payload.new.id
                ? payload.new
                : classification
            )
          );
          setNow(new Date());
        }
      )
      .subscribe((status) => {
        console.log(classificationUpdateChannel.topic, status);
      });

    unitDeleteChannel
      .on<Unit>(
        "postgres_changes",
        {
          event: "DELETE",
          table: "units",
          schema: "public",
        },
        (payload) => {
          setUnits((current) =>
            current.filter((unit) => unit.id !== payload.old.id)
          );
          setNow(new Date());
        }
      )
      .subscribe((status) => {
        console.log(unitDeleteChannel.topic, status);
      });

    unitInsertChannel
      .on<Unit>(
        "postgres_changes",
        {
          event: "INSERT",
          table: "units",
          schema: "public",
        },
        (payload) => {
          setUnits((current) =>
            current.concat({
              ...payload.new,
              position: parsePosition(
                payload.new.position as unknown as string
              ),
            })
          );
          setNow(new Date());
        }
      )
      .subscribe((status) => {
        console.log(unitInsertChannel.topic, status);
      });

    unitUpdateChannel
      .on<Unit>(
        "postgres_changes",
        {
          event: "UPDATE",
          table: "units",
          schema: "public",
        },
        (payload) => {
          setUnits((current) =>
            current.map((unit) =>
              unit.id === payload.new.id
                ? {
                    ...payload.new,
                    position: parsePosition(
                      payload.new.position as unknown as string
                    ),
                  }
                : unit
            )
          );
          setNow(new Date());
        }
      )
      .subscribe((status) => {
        console.log(unitUpdateChannel.topic, status);
      });

    return () => {
      playerDeleteChannel.unsubscribe();
      playerInsertChannel.unsubscribe();
      playerUpdateChannel.unsubscribe();
      classificationInsertChannel.unsubscribe();
      classificationsDeleteChannel.unsubscribe();
      classificationUpdateChannel.unsubscribe();
      unitDeleteChannel.unsubscribe();
      unitInsertChannel.unsubscribe();
      unitUpdateChannel.unsubscribe();
    };
  }, [supabaseClient]);

  useEffect(() => {
    const clickHandler = () => {
      setSelectedUnitId(undefined);
    };

    const onPointerMove = (event: PointerEvent) => {
      if (event.buttons === 2) {
        setCamera(({ x, y, zoom }) => ({
          x: x - event.movementX / zoom,
          y: y - event.movementY / zoom,
          zoom,
        }));
      }
    };

    const contextMenuHandler = (event: MouseEvent) => {
      event.preventDefault();
    };

    const keyDownHandler = (event: KeyboardEvent) => {
      if (selectedUnitId && isDirectionKey(event.key)) {
        supabaseClient
          .rpc("move_unit", {
            unit_id: selectedUnitId,
            action_id: "89c654fd-980c-48e2-9a75-de95f3bc73ac",
            direction: DIRECTIONS[event.key],
          })
          .then((result) => {
            if (result.status < 200 || result.status >= 300) {
              console.error(result);
            }
          });
      }
      if (event.key === "i") {
        setShowIconEditor((current) => !current);
      }
      if (event.key === "g") {
        setShowGrid((current) => !current);
      }
    };

    const wheelHandler = (event: WheelEvent) => {
      setCamera((current) => ({
        ...current,
        zoom: Math.min(
          Math.max(current.zoom + (event.deltaY < 0 ? 1 : -1), MIN_ZOOM),
          MAX_ZOOM
        ),
      }));
    };

    window.addEventListener("click", clickHandler);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("contextmenu", contextMenuHandler);
    window.addEventListener("keydown", keyDownHandler);
    window.addEventListener("wheel", wheelHandler);

    return () => {
      window.removeEventListener("click", clickHandler);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("contextmenu", contextMenuHandler);
      window.removeEventListener("keydown", keyDownHandler);
      window.removeEventListener("wheel", wheelHandler);
    };
  }, [selectedUnitId, supabaseClient]);

  return (
    <div className="game">
      {showIconEditor ? (
        <div className="icon-editor">
          <IconEditor initialPixels={selectedClassification?.icon} />
        </div>
      ) : null}
      <div
        className="info"
        onClick={(event) => {
          event.stopPropagation();
        }}
      >
        {selectedClassification ? (
          <div>{selectedClassification.name}</div>
        ) : null}
        {selectedUnit ? (
          <>
            <div>{selectedUnit.id}</div>
            <div>
              Action Points:{" "}
              {new Intl.NumberFormat("en", {
                notation: "compact",
              }).format(
                Math.min(
                  345600000,
                  Math.floor(
                    differenceInMilliseconds(
                      now,
                      parseISO(selectedUnit.timestamp)
                    ) / 2
                  )
                )
              )}
              /
              {new Intl.NumberFormat("en", {
                notation: "compact",
              }).format(345600000)}
            </div>
            <progress
              max={345600000}
              value={Math.min(
                345600000,
                Math.floor(
                  differenceInMilliseconds(
                    now,
                    parseISO(selectedUnit.timestamp)
                  ) / 2
                )
              )}
            />
          </>
        ) : null}
        <div>
          <input
            type="range"
            min={MIN_ZOOM}
            max={MAX_ZOOM}
            value={camera.zoom}
            onChange={(event) => {
              setCamera((current) => ({
                ...current,
                zoom: parseInt(event.target.value, 10),
              }));
            }}
          />
        </div>
        <div>
          <button
            onClick={async () => {
              await supabaseClient.auth.signOut();
            }}
          >
            Sign out
          </button>
          {player ? null : (
            <button
              onClick={async () => {
                await supabaseClient.rpc("join_game").then((result) => {
                  if (result.status < 200 || result.status >= 300) {
                    console.error(result);
                  }
                });
              }}
            >
              Join Game
            </button>
          )}
        </div>
      </div>
      <ParentSize>
        {({ width, height }) => {
          const transformX = (x: number) =>
            (x - camera.x) * camera.zoom + width / 2;
          const transformY = (y: number) =>
            (y - camera.y) * camera.zoom + height / 2;
          return (
            <svg width={width} height={height}>
              {showGrid
                ? [-50, -40, -30, -20, -10, 0, 10, 20, 30, 40, 50].map((x) =>
                    [-50, -40, -30, -20, -10, 0, 10, 20, 30, 40, 50].map(
                      (y) => (
                        <>
                          <path
                            d={`M ${transformX(x) - 5} ${transformY(y)} L ${
                              transformX(x) + 5
                            } ${transformY(y)} M ${transformX(x)} ${
                              transformY(y) - 5
                            } L ${transformX(x)} ${transformY(y) + 5}`}
                            stroke="#111"
                            strokeWidth={0.5}
                          />
                          <text
                            x={transformX(x) + 10}
                            y={transformY(y) + 2}
                            fontSize={10}
                            fontFamily="monospace"
                            fill="#000"
                          >
                            ({x},{y})
                          </text>
                        </>
                      )
                    )
                  )
                : null}
              {units.map((unit) => {
                const classification = classifications.find(
                  (c) => c.id === unit.classification_id
                );
                const owner = players.find(
                  (p) => p.id === unit.owner_id //&& p.user_id !== null
                );
                return (
                  <Token
                    key={unit.id}
                    x={transformX(unit.position[0].x)}
                    y={transformY(unit.position[0].y)}
                    width={
                      transformX(unit.position[1].x) -
                      transformX(unit.position[0].x)
                    }
                    height={
                      transformY(unit.position[1].y) -
                      transformY(unit.position[0].y)
                    }
                    icon={classification?.icon}
                    selected={selectedUnitId === unit.id}
                    color={owner?.color}
                    owner={player ? unit.owner_id === player.id : false}
                    onClick={(event) => {
                      setSelectedUnitId(
                        selectedUnitId === unit.id ? undefined : unit.id
                      );
                      event.stopPropagation();
                    }}
                  />
                );
              })}
            </svg>
          );
        }}
      </ParentSize>
    </div>
  );
};

export default Game;
