import asyncio
import asyncpg

async def create_database():
    print(f"Connecting to postgres...")

    # Connect to the default 'postgres' database
    try:
        sys_conn = await asyncpg.connect(
            user='postgres',
            password='Nunalex#1',
            host='localhost',
            port=5433,
            database='postgres'
        )
    except Exception as e:
        print(f"Failed to connect to 'postgres' database: {e}")
        return

    target_db = 'body_fat_tracker'

    try:
        # Check if database exists
        exists = await sys_conn.fetchval("SELECT 1 FROM pg_database WHERE datname = $1", target_db)
        if not exists:
            print(f"Creating database '{target_db}'...")
            await sys_conn.execute(f'CREATE DATABASE "{target_db}"')
            print(f"Database '{target_db}' created successfully.")
        else:
            print(f"Database '{target_db}' already exists.")
    except Exception as e:
        print(f"Error creating database: {e}")
    finally:
        await sys_conn.close()

if __name__ == "__main__":
    asyncio.run(create_database())
