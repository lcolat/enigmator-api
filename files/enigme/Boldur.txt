//
// Created by user on 25/12/2018.
//

#include "GenerateMap.h"
#include "Entity.h"

using namespace std;

GenerateMap::GenerateMap(const SpritesSheet& spritesSheet, const std::map<string, EntityGenerator::FunctionPtrCreateEntity> &mapEntity)
        : spritesSheet(spritesSheet), mapEntity(mapEntity)
{
}

shared_ptr<Map> GenerateMap::createMap(unsigned int sizeX, unsigned int sizeY, std::string mapFile)
{
    string fileName = EntityManager::MAP_PATH + "/" + mapFile;
    ifstream mapF(fileName.c_str());
    if (!mapF) throw std::runtime_error("Could not open file");

    shared_ptr<Map> map = make_shared<Map>();

    string entityName;
    //Entity entity;
    string bracket;
    while (!mapF.eof())
    {
        mapF >> entityName;

        if(entityName.empty()) break;
        if(mapEntity.find(entityName) == mapEntity.end())
            throw std::runtime_error("Generation of Map fail : \"" + entityName + "\" is not a valid key");

        mapF >> bracket;

        long tabPos[4] = {0, 0, 0, 0};

        while(bracket != "}")
        {
            fpos<mbstate_t> pos;
            unsigned int cnt;
            string next;

            for(cnt = 0; cnt < 4; cnt++)
            {
                pos = mapF.tellg();
                mapF >> next;

                if(next == ";") break;
                else if(next == "D")
                {
                    tabPos[cnt] = -1;
                    continue;
                }

                mapF.seekg(pos);
                mapF >> tabPos[cnt];
            }
            if(cnt == 2) addSprite(static_cast<unsigned int>(tabPos[0]), static_cast<unsigned int>(tabPos[1]),
                    mapEntity[entityName], map);
            else
            {
                addResizedSprite(tabPos, mapEntity[entityName], map);
                mapF >> next;            /// To pass the ';' forgive
            }

            pos = mapF.tellg();
            mapF >> bracket;
            mapF.seekg(pos);
        }
        mapF >> bracket;
    }

    return map;
}

void GenerateMap::addElementToMap(const std::string &posElementFile, Map &map)
{

}

void GenerateMap::addElementToMap(const std::vector<std::shared_ptr<Entity>> &entityList, Map &map)
{

}

void GenerateMap::addSprite(unsigned int posX, unsigned int posY, EntityGenerator::FunctionPtrCreateEntity generateEntity, shared_ptr<Map>& map)
{
    shared_ptr<Entity> entityPtr = generateEntity(spritesSheet, sf::Vector2f(posX, posY), sf::Vector2f(-1, -1));

    //EntityManager::entities.push_back(entityPtr);
    map->addEntityToMatrix(entityPtr);
}

void GenerateMap::addResizedSprite(long pos[4], EntityGenerator::FunctionPtrCreateEntity generateEntity, shared_ptr<Map>& map)
{
    shared_ptr<Entity> entityPtr = generateEntity(spritesSheet, sf::Vector2f(pos[0], pos[1]), sf::Vector2f(pos[2], pos[3]));
    map->addEntityToMatrix(entityPtr);
}




