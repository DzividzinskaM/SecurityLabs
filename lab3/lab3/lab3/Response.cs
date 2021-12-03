using System;
using System.Collections.Generic;
using System.Text;
using System.Text.Json.Serialization;

namespace lab3
{
    public class Response
    {
        [JsonPropertyName("message")]
        public string message { get; set; }

        [JsonPropertyName("realNumber")]
        public uint realNumber { get; set; }
    }
}
