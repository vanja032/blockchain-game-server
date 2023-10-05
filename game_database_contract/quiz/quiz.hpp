#include <inery/inery.hpp>
#include <inery/singleton.hpp>

#include <utility> 
#include <algorithm> 

using namespace inery;

class [[inery::contract("quiz")]] quiz : public inery::contract {
    public:
        quiz(name receiver, name code, datastream<const char*> ds): contract(receiver, code, ds),
        _questions(receiver, receiver.value),
        _users(receiver, receiver.value),
        _gamedata(receiver, receiver.value)
        {}

        //questions table
        struct [[inery::table("questions")]] questions {
            uint64_t                  question_id;
            std::string               question;
            std::vector <std::string> answers;

            uint64_t primary_key() const { return question_id; }

            INELIB_SERIALIZE(questions, (question_id)(question)(answers));
        };
        typedef inery::multi_index<"questions"_n, questions> questions_t;
        questions_t _questions;

        //users table
        struct [[inery::table("users")]] users {
            uint64_t                  user_id;
            name                      username;
            std::string               email;
            std::string               password;
            uint64_t                  max_score = 0;

            uint64_t primary_key() const { return user_id; }
            uint64_t by_username() const { return username.value; }

            INELIB_SERIALIZE(users, (user_id)(username)(email)(password)(max_score));
        };
        typedef inery::multi_index<"users"_n, users, inery::indexed_by<"username"_n,inery::const_mem_fun<users,uint64_t, &users::by_username>>> users_t;
        users_t _users;

        //game data singleton
        struct [[inery::table("gamedata")]] gamedata {
            uint64_t                               total_games_played;
            std::vector<std::pair<name, uint64_t>> high_scores;

            INELIB_SERIALIZE(gamedata, (total_games_played)(high_scores));
        }gamerow;
        using game_data = inery::singleton<"gamedata"_n, gamedata>;
        game_data _gamedata;

        //questions actions
        [[inery::action]] void insertq (std::string question, std::vector<std::string> answers);
        [[inery::action]] void updateq (uint64_t question_id, std::string question, std::vector<std::string> answers);
        [[inery::action]] void deleteq (uint64_t question_id);

        //answers actions
        [[inery::action]] void updatea (uint64_t question_id, std::vector<std::string> answers);
        [[inery::action]] void inserta (uint64_t question_id, std::string answer);
        [[inery::action]] void deletea (uint64_t question_id, std::string answer);

        //user actions
        [[inery::action]] void insertu (name username, std::string email, std::string password);
        [[inery::action]] void updateu (uint64_t user_id, name username, std::string email, std::string password);
        [[inery::action]] void deleteu (uint64_t user_id);

        //max score action
        [[inery::action]] void updatem (uint64_t user_id, uint64_t score);

        //score actions
        [[inery::action]] void inserts (name username, uint64_t score);
        [[inery::action]] void deletes ();

        //singleton actions
        [[inery::action]] void inc();
        [[inery::action]] void set(uint64_t value);
        [[inery::action]] void get();
};
