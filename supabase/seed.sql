INSERT INTO
  classifications (
    id,
    name,
    area,
    icon,
    approved,
    autonomous,
    container
  )
VALUES
  (
    '1a9e3b4e-197f-4341-b9cc-2d3e691d7c30',
    'Person',
    100,
    '\x0000000000000000000000000000000000000000000180000003c0000003c0000003c000000180000007e000000ff000000ff000000ff000000ff000000ff000000ff000000ff000000ff000000ff0000003c0000003c0000003c0000003c0000003c0000003c0000003c0000003c00000000000000000000000000000000000'::bytea,
    true,
    true,
    true
  ),
  (
    'c1d8d223-5499-4544-9f49-621e0a00b54c',
    'Car (Sedan)',
    961,
    '\x0000000000000000000000000000000000000000000000000000000000000000000000000007fc0000084200001041000020408000ffffe007fffff01ffffff03ffffff03ffffff03ffffff03fffffe01fffffc003e03e0001c01c00000000000000000000000000000000000000000000000000000000000000000000000000'::bytea,
    true,
    false,
    true
  ),
  (
    '80f606c1-fc31-4015-afb8-141c0e090db5',
    'Bicycle',
    144,
    '\x000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000007800000050f00000106000003fe000003cf00000f6bf0001f39f8003bbfdc00359fac003b99dc001f00f8000e007000000000000000000000000000000000000000000000000000000000000000000'::bytea,
    true,
    false,
    true
  ),
  (
    '167fb405-e933-46cc-b87e-eeaa2c76b31f',
    'Pine Tree',
    900,
    -- '\x0000000000000000000dc000003fd800003ffc00007ffe0000bffa0000ffff0000ffff0001fffd0001fffe00017ffe0000fffa00003ffe00007ffc00007ffc00002ff400001ff800001be8000005a00000018000000180000001800000030000000300000003000000078000000fc00000000000000000000000000000000000'::bytea,
    '\x000000000000000000018000000180000003c0000003c0000003c0000007e0000007e0000007e000000ff000000ff000000ff000001ff800001ff800001ff800001ff800003ffc00003ffc00003ffc00003ffc00007ffe00003ffc00000ff0000001800000018000000180000001800000000000000000000000000000000000'::bytea,
    true,
    false,
    false
  ),
  (
    '441eb754-5f31-455c-9428-3c381d5c6cce',
    'Fountain',
    144,
    -- '\x00000000000000000000000000000000000000000000000000000000000000000000000000018000001ff800002ff4000027c40000099000002bd4000023c40000099000002bd4000027e400010ff08003ffffc003ffffc003ffffc0000000000000000000000000000000000000000000000000000000000000000000000000'::bytea,
    '\x00000000000000000000000000000000000000000000000000000000001ff800002ff4000023c400000bd000002994000023c400000bd0000029940000ffff00007ffe00003ffc000007e0000003c0000001800000018000000180000001800000018000000180000003c0000007e0000007e000000000000000000000000000'::bytea,
    true,
    false,
    false
  );

INSERT INTO
  actions (
    id,
    classification_id,
    type,
    name,
    action_point_cost,
    approved
  )
VALUES
  (
    '89c654fd-980c-48e2-9a75-de95f3bc73ac',
    '1a9e3b4e-197f-4341-b9cc-2d3e691d7c30',
    'move',
    'Walk',
    1200,
    true
  ),
  (
    '5eb28a41-cd11-4757-9148-70e1b36435e9',
    'c1d8d223-5499-4544-9f49-621e0a00b54c',
    'move',
    'Drive',
    60,
    true
  ),
  (
    'e54ae722-35af-4ea1-b3e7-9cb016d45213',
    '80f606c1-fc31-4015-afb8-141c0e090db5',
    'move',
    'Ride',
    300,
    true
  );

INSERT INTO
  units (classification_id, position)
VALUES
  (
    '1a9e3b4e-197f-4341-b9cc-2d3e691d7c30',
    box '((0,0),(10,10))'
  ),
  (
    '1a9e3b4e-197f-4341-b9cc-2d3e691d7c30',
    box '((20,-5),(30,5))'
  ),
  (
    '1a9e3b4e-197f-4341-b9cc-2d3e691d7c30',
    box '((31,-4),(41,6))'
  ),
  (
    '1a9e3b4e-197f-4341-b9cc-2d3e691d7c30',
    box '((-20,-20),(-10,-10))'
  ),
  (
    'c1d8d223-5499-4544-9f49-621e0a00b54c',
    box '((-10,-40),(21,-9))'
  ),
  (
    '80f606c1-fc31-4015-afb8-141c0e090db5',
    box '((100,0),(112,12))'
  ),
  (
    '167fb405-e933-46cc-b87e-eeaa2c76b31f',
    box '((-100,-100),(-70,-70))'
  ),
  (
    '167fb405-e933-46cc-b87e-eeaa2c76b31f',
    box '((-100,-60),(-70,-30))'
  ),
  (
    '167fb405-e933-46cc-b87e-eeaa2c76b31f',
    box '((-100,-20),(-70,10))'
  ),
  (
    '441eb754-5f31-455c-9428-3c381d5c6cce',
    box '((-50,-132),(-38,-120))'
  );